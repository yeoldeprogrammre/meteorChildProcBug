var Replies = new Meteor.Collection('replies');

if (Meteor.isClient) {
   Template.terminal.window = function() {
      return replies.findOne().message;
    };

     Template.terminal.events = {
      'click .run': function() {
       Meteor.call('command');
      }
     };
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    cmd = __meteor_bootstrap__.require('child_process').spawn('cmd');
    cmd.stdout.on('data', function(data){
      Fiber(function(){
        Replies.remove({});
        Replies.insert({message: data});
      }).run();
    });
   });
 
 Meteor.methods({
  'command': function(line) {
    cmd.stdin.write("echo hi \\n");
  }
 });
}
