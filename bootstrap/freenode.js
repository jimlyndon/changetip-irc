module.exports = {
  port: 6697, // ssl - not every irc network supports ssl
  host: 'irc.freenode.org',
  nickname: 'ChangeTip',
  username: process.env.USER,
  realname: process.env.USER,
  password: process.env.CRED,
  secure: true,
  channels: ['#changetip','#changecoin','#changecoin1','#changecoin2','#changecoin3','#changecoin4','#changecoin5']
};