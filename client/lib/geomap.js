function addAccessor(obj, name, value) {
    obj[name] = (_) => {
        if (typeof _ === 'undefined')
            return obj.properties[name] || value;
        obj.properties[name] = _;
        return obj;
    };
}

class Geomap {
    constructor() {
        // Set default properties optimized for naturalEarth projection.
        this.properties = {
            geofile: null,
            height: null,
            postUpdate: null,
            projection: d3.geo.naturalEarth,
            rotate: [0, 0, 0],
            scale: null,
            translate: null,
            unitId: 'iso3',
            unitPrefix: 'geomap-unit-',
            units: 'units',
            unitTitle: (d) => d.properties.name,
            width: null,
            zoomFactor: 4
        };

        // Setup methods to access properties.
        for (let key in this.properties)
            addAccessor(this, key, this.properties[key]);

        // Store internal properties.
        this._ = {};
    }

    clicked(d) {
        let k = 1,
            x0 = this.properties.width / 2,
            y0 = this.properties.height / 2,
            x = x0,
            y = y0;

        if (d && d.hasOwnProperty('geometry') && this._.centered !== d) {
            let centroid = this.path.centroid(d);
            x = centroid[0];
            y = centroid[1];
            k = this.properties.zoomFactor;
            this._.centered = d;
        } else
            this._.centered = null;

        this.svg.selectAll('path.geomap-unit')
           .classed('active', this._.centered && ((_) => _ === this._.centered));

        this.svg.selectAll('g.zoom')
            .transition()
            .duration(750)
            .attr('transform', `translate(${x0}, ${y0})scale(${k})translate(-${x}, -${y})`);
    }

    /**
     * Load geo data once here and draw map. Call update at the end.
     *
     * By default map dimensions are calculated based on the width of the
     * selection container element so they are responsive. Properties set before
     * will be kept.
     */
    draw(selection, self) {
        if (!self.properties.width)
            self.properties.width = selection.node().getBoundingClientRect().width;

        if (!self.properties.height)
            self.properties.height = self.properties.width / 1.92;

        if (!self.properties.scale)
            self.properties.scale = self.properties.width / 5.8;

        if (!self.properties.translate)
            self.properties.translate = [self.properties.width / 2, self.properties.height / 2];

        //console.log("put in div");
        // put in div responsive to size
        self.svg = selection
            .append('svg')
            //responsive SVG needs these 2 attributes and no width and height attr
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 "+self.properties.width+" "+self.properties.height)
            //class to make it responsive
            .classed("svg-content-responsive", true) 
            //.attr('width', self.properties.width)
            //.attr('height', self.properties.height);
        //console.log(self.svg);

        //console.log("rect");
        /**
        self.svg.append('rect')
            .attr('class', 'geomap-background')
            .attr('width', self.properties.width)
            .attr('height', self.properties.height)
            .on('click', self.clicked.bind(self));
        **/
        //console.log(self.svg);

        //console.log("proj");
        // Set map projection and path.
        let proj = self.properties.projection()
            .scale(self.properties.scale)
            .translate(self.properties.translate)
            .precision(.1);
        //console.log(proj);

        // Not every projection supports rotation, e. g. albersUsa does not.
        if (proj.hasOwnProperty('rotate') && self.properties.rotate)
            proj.rotate(self.properties.rotate);

        self.path = d3.geo.path().projection(proj);

        // Load and render geo data.
        d3.json(self.properties.geofile, (error, geo) => {
            //console.log("geo countries.json");
            self.geo = geo;
            //console.log(self.geo);
            //console.log("geomap-units zoom etc");
            self.svg.append('g').attr('class', 'units zoom')
                .selectAll('path')
                .data(topojson.feature(geo, geo.objects[self.properties.units]).features)
                .enter().append('path')
                    .attr('class', (d) => `geomap-unit ${self.properties.unitPrefix}${d.id}`)
                    .attr('d', self.path)
                    .on('click', self.clicked.bind(self))
                    .append('title')
                        .text(self.properties.unitTitle);
            //console.log(self.svg);
            self.update();
        });
    }

    update() {
        if (this.properties.postUpdate)
            this.properties.postUpdate();
    }
}

d3.geomap = () => new Geomap();

class Choropleth extends Geomap {
    constructor() {
        super();

        let properties = {
            colors: ["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"],
            column: null,
            domain: null,
            duration: null,
            format: d3.format(',.02f'),
            legend: false,
            valueScale: d3.scale.quantize
        };

        for (let key in properties) {
            this.properties[key] = properties[key];
            addAccessor(this, key, properties[key]);
        }
    }

    columnVal(d) {
        return +d[this.properties.column];
    }

    draw(selection, self) {
        self.data = selection.datum();
        super.draw(selection, self);
    }

    update() {
        let self = this;
        //console.log(self);
        self.extent = d3.extent(self.data, self.columnVal.bind(self));
        self.colorScale = self.properties.valueScale()
            .domain(self.properties.domain || self.extent)
            .range(self.properties.colors);

        // Remove fill styles that may have been set previously.
        self.svg.selectAll('path.geomap-unit').style('fill', null);

        // Add new fill styles based on data values.
        self.data.forEach((d) => {
            let uid = d[self.properties.unitId],
                val = d[self.properties.column],
                fill = self.colorScale(val);

            // selectAll must be called and not just select, otherwise the data
            // attribute of the selected path object is overwritten with self.data.
            let unit = self.svg.selectAll(`.${self.properties.unitPrefix}${uid}`);

            // Data can contain values for non existing units.
            if (!unit.empty()) {
                if (self.properties.duration)
                    unit.transition().duration(self.properties.duration).style('fill', fill);
                else
                    unit.style('fill', fill);

                // New title with column and value.
                let text = self.properties.unitTitle(unit.datum());
                val = self.properties.format(val);
                unit.select('title').text(`${text}\n\n${self.properties.column}: ${val}`);
            }
        });

        if (self.properties.legend)
            self.drawLegend(self.properties.legend);

        // Make sure postUpdate function is run if set.
        super.update();
    }

    /**
     * Draw legend including color scale and labels.
     *
     * If bounds is set to true, legend dimensions will be calculated based on
     * the map dimensions. Otherwise bounds must be an object with width and
     * height attributes.
     */
    drawLegend(bounds=null) {
        let self = this,
            steps = self.properties.colors.length,
            wBox,
            hBox;

        const wFactor = 10,
            hFactor = 3;

        if (bounds === true) {
            wBox = self.properties.width / wFactor;
            hBox = self.properties.height / hFactor;
        } else {
            wBox = bounds.width;
            hBox = bounds.height;
        }

        const wRect = wBox / (wFactor * .75),
            hLegend = hBox - (hBox / (hFactor * 1.8)),
            offsetText = wRect / 2,
            offsetY = self.properties.height - hBox,
            tr = 'translate(' + offsetText + ',' + offsetText * 3 + ')';

        // Remove possibly existing legend, before drawing.
        self.svg.select('g.geomap-legend').remove();

        // Reverse a copy to not alter colors array.
        const colors = self.properties.colors.slice().reverse(),
            hRect = hLegend / steps,
            offsetYFactor = hFactor / hRect;

        let legend = self.svg.append('g')
            .attr('class', 'geomap-legend')
            .attr('width', wBox)
            .attr('height', hBox)
            .attr('transform', 'translate(0,' + offsetY + ')');

        legend.append('rect')
            .style('fill', '#fff')
            .attr('class', 'geomap-legend-bg')
            .attr('width', wBox)
            .attr('height', hBox);

        // Draw a rectangle around the color scale to add a border.
        legend.append('rect')
            .attr('class', 'geomap-legend-bar')
            .attr('width', wRect)
            .attr('height', hLegend)
            .attr('transform', tr);

        let sg = legend.append('g')
            .attr('transform', tr);

        // Draw color scale.
        sg.selectAll('rect')
            .data(colors)
            .enter().append('rect')
            .attr('y', (d, i) => i * hRect)
            .attr('fill', (d, i) => colors[i])
            .attr('width', wRect)
            .attr('height', hRect);

        // Determine display values for lower and upper thresholds. If the
        // minimum data value is lower than the first element in the domain
        // draw a less than sign. If the maximum data value is larger than the
        // second domain element, draw a greater than sign.
        let minDisplay = self.extent[0],
            maxDisplay = self.extent[1],
            addLower = false,
            addGreater = false;

        if (self.properties.domain) {
            if (self.properties.domain[1] < maxDisplay)
                addGreater = true;
            maxDisplay = self.properties.domain[1];

            if (self.properties.domain[0] > minDisplay)
                addLower = true;
            minDisplay = self.properties.domain[0];
        }

        // Draw color scale labels.
        sg.selectAll('text')
            .data(colors)
            .enter().append('text')
            .text((d, i) => {
                // The last element in the colors list corresponds to the lower threshold.
                if (i === steps - 1) {
                    let text = self.properties.format(minDisplay);
                    if (addLower)
                        text = `< ${text}`;
                    return text;
                }
                return self.properties.format(self.colorScale.invertExtent(d)[0]);
            })
            .attr('class', (d, i) => 'text-' + i)
            .attr('x', wRect + offsetText)
            .attr('y', (d, i) => i * hRect + (hRect + hRect * offsetYFactor));

        // Draw label for end of extent.
        sg.append('text')
            .text(() => {
                let text = self.properties.format(maxDisplay);
                if (addGreater)
                    text = `> ${text}`;
                return text;
            })
            .attr('x', wRect + offsetText)
            .attr('y', offsetText * offsetYFactor * 2);
    }
}

d3.geomap.choropleth = () => new Choropleth();
