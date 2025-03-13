// This File Loads all the contents needed for a session
/*
    All steps are registered in 'ContentLoadingStage' variable
    1. Check if we have a user -> isUser? 
        true:
            1. is the user signed in -> isUserAuth?
                true:
                    Show dashboard
                false:
                    1. Populate username field
                    2. require password
        false:
            Show signIn/signUp View
    
*/

import userProfile from "../../../appContent/userProfile.json" // Grabbed from Firebase
import userSetting from "../../../appContent/userSettings.json"// Grabbed from Firebase
import userContacts from "../../../appContent/userContacts.json"// Grabbed from Firebase
