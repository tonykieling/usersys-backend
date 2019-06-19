const eventType = {
  create_user_success       :  "1- User created",
  create_user_fail          :  "2- User trying to created an already existed email/account",
  login_success             :  "3- User Logged",
  login_fail                :  "4- Login Failed",
  logout                    :  "5- User Logout",
  update_user_success       :  "6- User Updated - success",
  update_user_fail          :  "7- User Updated - fail",
  delete_user_success       :  "8- User Deleted - success",
  delete_user_fail          :  "9- Delete User - fail",
  check_user_email_success  : "10- User email checked - success",
  check_user_email_fail     : "11- User email checked - fail",
  deactivate_user_success   : "12- User deactivated - success",
  deactivate_user_fail      : "13- User deactivated - fail",
  read_all_logins_success   : "14- User read all logins - success",
  read_all_logins_fail   : "14- User read all logins - fail",
}

module.exports = eventType;
