Accounts.emailTemplates.siteName = "Pteraform";
Accounts.emailTemplates.from = "Pteraform Admin <admin@pteraform.com>";
Accounts.emailTemplates.verifyEmail.subject = function (user) {
  if (user.profile && user.profile.name) {
    return "Welcome to Pteraform, " + user.profile.name;
  } else {
    return "Welcome to Pteraform";
  }
};
Accounts.emailTemplates.verifyEmail.text = function (user, url) {
   return "Hello,\n"
        + "To verify your Pteraform account email, simply click the link below:\n\n"
        + url;
};

Meteor.startup(function() {
 Accounts.urls.verifyEmail = function(token) {
    return Meteor.absoluteUrl('verify-email/' + token);
  };
});
