import mongoose from "mongoose";

volunteerList = [];

class listMember { //for non-organizers
    accountID;
    name;
    profilePic;
    role;
    pendingApproval = true;
    attended = false;

};

class extendedListMember extends listMember { //for organizers
    email;
    phoneString;
};

function loadVisitorsView() { //load all visitors who are already approved
    loadVolunteersView(); //currently does the same thing, but potentially could change
}
function loadVolunteersView() { //load all visitors who are already approved

}

function loadOrganizersView() {
    
}

function signUp() {
    //get your user info
    //create extendedListMember
    //save to database
}

function denyApproval(accountID) {
    //remove the denied member in the database
    loadOrganizersView(); //show updated list
}