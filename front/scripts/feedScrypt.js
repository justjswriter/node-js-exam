if(localStorage.getItem("user") === null){
    window.location.href = `index.html`;
}

const postsFeed = document.querySelector(".posts_feed_block")
const userId = JSON.parse(localStorage.getItem("user"));

const BASE_URL = "http://localhost:8080";

const logOut = () => {
    localStorage.clear();
    window.location.href = `index.html`;
}

const fetchData = async (route) => {
    const response = await fetch(BASE_URL + route);
    return await response.json();
};

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

const loadAllPosts = async () => {
    postsFeed.innerHTML = ""
    const result = await fetchData("/posts");
    const usersData = await fetchData("/users");
    const userData = await fetchData(`/users/${userId}`);
    const followedUsers = userData.followedAuthors
    const usersFeed = result.filter((user) => followedUsers.includes(user.author))
    usersFeed.forEach(post => {
        let currentUser = usersData.filter((user) => post.author == user._id)
        postsFeed.innerHTML += `
        <div class="post_block">
        <div class="user_info">
            <div class="user_logo">
                <img src="http://localhost:8080/userIcon.png" alt="">
            </div>
            <p class="post_author">${currentUser[0].fullName}</p>
            <p class="post_date">${post.date}</p>
        </div>
        <p class="post_header">${post.postHeader}</p>
        <p class="post_data">${post.postData}</p>
        <div class="post_like_part">
            <img class="like_post_btn"  src="http://localhost:8080/like.png" alt="" onclick="likePost('${post._id}')">
            <p class="likes_amount">${post.likesAmount}</p>
            <img class="like_post_btn" src="http://localhost:8080/unlike.png" alt="" onclick="unlikePost('${post._id}')">
        </div>
    </div>
        `
    });
}

const likePost = async (postId) =>{
    await fetch(BASE_URL + `/posts/like/${postId}`);
    loadAllPosts()

}

const unlikePost = async (postId) =>{
    await fetch(BASE_URL + `/posts/unlike/${postId}`);
    loadAllPosts()
}

loadAllPosts()