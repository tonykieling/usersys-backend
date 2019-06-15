const eventType = {
  create_user_success       :  "1- User created",
  create_user_fail          :  "2- User trying to created an already existed email/account",
  login_success             :  "3- User Logged",
  login_fail                :  "4- Login Failed",
  logout                    :  "5- User Logout",
  update_user_success       :  "6- User Updated",
  update_user_fail          :  "7- User Updated",
  delete_user_success       :  "8- User Deleted",
  delete_user_fail          :  "9- Delete User Fail",
  check_user_email_success  : "10- User email checked with success",
  check_user_email_fail     : "11- User email checked with fail"
}

module.exports = eventType;
