var Replies = new Meteor.Collection('replies');

if (Meteor.isClient) {
   Template.terminal.window = function() {
    if(!Replies.findOne()) return "";
      return Replies.findOne().message;
    };

     Template.terminal.events = {
      'click .run': function() {
       Meteor.call('command');
      }
     };
}

if (Meteor.isServer) {
  Meteor.startup(function() {
    cmd = __meteor_bootstrap__.require('child_process').spawn('irb', [], {detached: true, stdio:'pipe'});
    cmd.stdout.on('data', function(data){
      Fiber(function(){
        Replies.remove({});
        Replies.insert({message: data});
      }).run();
    });

    cmd.stderr.on("data", function(data){
      console.log("error: " + data);
    });

    cmd.on('exit', function(){
      console.log("cmd exited");
    });
   });
 
 Meteor.methods({
  'command': function(line) {
    console.log("hi again");
    cmd.stdin.write('puts "hi" \n');
    console.log(cmd); 
  }
 });
}
