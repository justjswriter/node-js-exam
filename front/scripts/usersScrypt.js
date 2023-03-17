if(localStorage.getItem("user") === null){
    window.location.href = `index.html`;
}

const userId = JSON.parse(localStorage.getItem("user"));
const usersLists = document.querySelector(".users_list")

const BASE_URL = "http://localhost:8080";

const fetchData = async (route) => {
    const response = await fetch(BASE_URL + route);
    return await response.json();
};

const logOut = () => {
    localStorage.clear();
    window.location.href = `index.html`;
}

const postData = async (route, payload) => {
    fetch(
        BASE_URL + route, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: payload,
        },
    )
    .then(() => console.log("parsed"))
    .catch(() => console.log("Error sending request"));
};

const loadUsersData = async () => {
    usersLists.innerHTML = ""
    const result = await fetchData(`/users`);
    const userData = await fetchData(`/users/${userId}`);
    const followedUsers = userData.followedAuthors
    let usersWithoutCurrent = result.filter((user) => user._id !==userId
    )
    usersWithoutCurrent.forEach(user => {
        if(followedUsers.includes(user._id)){
            usersLists.innerHTML += `
            <div class="users_one">
                <div class="user_info">
                    <div class="user_logo">
                        <img src="http://localhost:8080/userIcon.png" alt="">
                    </div>
                    <p class="user_name">${user.fullName}</p>
                </div>
                <p class="user_about">${user.aboutAuthor}</p>
                <button class="follow_btn" onclick="unfollowUser('${user._id}')">Отписаться</button>
            </div>
            `
        }else{
            usersLists.innerHTML += `
            <div class="users_one">
                <div class="user_info">
                    <div class="user_logo">
                        <img src="http://localhost:8080/userIcon.png" alt="">
                    </div>
                    <p class="user_name">${user.fullName}</p>
                </div>
                <p class="user_about">${user.aboutAuthor}</p>
                <button class="follow_btn" onclick="followUser('${user._id}')">Подписаться</button>
            </div>
            `
        }
    });
}

const followUser = (followedUserId) => {
    const userId = JSON.parse(localStorage.getItem("user"));
    const payload = {
        userId: userId,
        followedUserId: followedUserId
    }
    const jsonPayload = JSON.stringify(payload)
    postData("/users/followUser", jsonPayload)
    loadUsersData()
}

const unfollowUser = (followedUserId) => {
    const userId = "63c2d998a2f87529a1937ebd";
    const payload = {
        userId: userId,
        followedUserId: followedUserId
    }
    const jsonPayload = JSON.stringify(payload)
    postData("/users/unfollowUser", jsonPayload)
    loadUsersData()
}


loadUsersData()