if(localStorage.getItem("user") === null){
    window.location.href = `index.html`;
}
const userId = JSON.parse(localStorage.getItem("user"));


const authorFullName = document.querySelector("#author_fullName");
const authorAboutField = document.querySelector("#author_about_field");

const authorFullNameInfo = document.querySelector("#author_fullName_info");
const authorAboutFieldInfo = document.querySelector("#author_about_field_info");

const authorPostsBlock = document.querySelector(".author_posts_block");
const updateProfileInfo = document.querySelector("#update_profile_info")
const changeAuthorInfoBtn = document.querySelector("#change_author_info_btn")
const closeUpdateUserModal = document.querySelector("#closeUpdateUserModal")

const createPostHeader = document.querySelector("#create_post_header");
const createPostData = document.querySelector("#create_post_data");
const createPostBtn = document.querySelector("#create_post_btn");
const createPostOpenModal = document.querySelector("#create_post_open_modal")
const closePostOpenModal = document.querySelector("#close_modal_create_post")


const updatePostModal = document.querySelector("#update_post_modal");
const updatePostBtn = document.querySelector("#create_post_btn");

const createPostModal = document.querySelector("#modal1")
const updatePostModalBack = document.querySelector("#modal2")
const updateUserModalBack = document.querySelector("#modal3")

const BASE_URL = "http://localhost:8080";


const fetchData = async (route) => {
    const response = await fetch(BASE_URL + route);
    const jsonResponse = await response.json();
    return jsonResponse;
};

const postData = async (route, payload) => {
    fetch(BASE_URL + route, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: payload,
    })
        .then(() => console.log("parsed"))
        .catch(() => console.log("Error sending request"));
};

const logOut = () => {
    localStorage.clear();
    window.location.href = `index.html`;
}

const fetchProfileData = async () => {
    const result = await fetchData(`/users/${userId}`);
    authorFullName.value = result.fullName;
    authorAboutField.innerHTML = result.aboutAuthor;

    authorFullNameInfo.textContent = result.fullName;
    authorAboutFieldInfo.textContent = result.aboutAuthor;
};

const userUpdateData = async (userId) =>{
    const payload = {
        fullName: authorFullName.value,
        aboutAuthor: authorAboutField.value,
    };
    const jsonPayload = JSON.stringify(payload);

    fetch(BASE_URL + `/users/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: jsonPayload,
    })
        .then(() => console.log("Updated user"))
        .catch(() => console.log("Error updating request"));

    closeModal(updateUserModalBack)
    setTimeout(()=> fetchProfileData(), 1000);
}

const fetchUsersPosts = async () => {
    authorPostsBlock.innerHTML = "";
    const result = await fetchData(`/posts/${userId}`);
    console.log(result);
    result.forEach((post) => {
        authorPostsBlock.innerHTML += `
        <div class="post_block">
            <p class="post_header">${post.postHeader}</p>
            <p class="post_data">${post.postData}</p>
            <p class="likes_amount">Likes: ${post.likesAmount}</p>
            <input class="delete_btn" type="button" value="delete" onclick="deletePost('${post._id}')">
            <input class="update_btn" type="button" value="update" onclick="startUpdatePost('${post._id}')">
        </div>
        `;
    });
};

const deletePost = (postId) => {
    fetch("http://localhost:8080/posts/" + postId, {
        method: "delete",
    })
        .then(() => console.log("post deleted"))
        .catch(() => console.log("Error deleting post"));
    setTimeout(() => fetchUsersPosts(), 1000);
};

const CreatePost = () => {
    const payload = {
        author: userId,
        postHeader: createPostHeader.value,
        postData: createPostData.value,
    };
    const jsonPayload = JSON.stringify(payload);

    postData("/posts", jsonPayload);

    createPostHeader.value = "";
    createPostData.value = "";
    closeModal(createPostModal)
    setTimeout(()=> fetchUsersPosts(), 1000);
};

const startUpdatePost = async (postId) =>{
    const result = await fetchData(`/posts/update/${postId}`);
    updatePostModalBack.style.display = 'block'
    updatePostModal.innerHTML = `
        <p class="modal_header">Редактировать пост</p>
        <label for="update_post_header">Текст Названия</label>
        <input type="text" name="" id="update_post_header" value="${result[0].postHeader}">
        <label for="update_post_data">текст поста</label>
        <textarea name="" id="update_post_data" cols="30" rows="10">${result[0].postData}</textarea>
        <button id="update_post_btn" onclick="postUpdateData('${result[0]._id}')">Сохранить</button>
        <button id="close_post_btn" onclick="closeModal(updatePostModalBack)">Отмена</button>
    `
}

const postUpdateData = async (postId) =>{
    const updatePostHeader = document.querySelector("#update_post_header");
    const updatePostData = document.querySelector("#update_post_data");
    const payload = {
        postHeader: updatePostHeader.value,
        postData: updatePostData.value,
    };
    console.log(updatePostHeader.value)
    const jsonPayload = JSON.stringify(payload);

    fetch(BASE_URL + `/posts/${postId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: jsonPayload,
    })
        .then(() => console.log("Updated"))
        .catch(() => console.log("Error updating request"));
    closeModal(updatePostModalBack)
    setTimeout(()=> fetchUsersPosts(), 1000);
}

const openModal= (modal) =>{
    modal.style.display = "block"
}

const closeModal= (modal) =>{
    modal.style.display = "none"
}

closePostOpenModal.addEventListener("click", ()=> closeModal(createPostModal))
createPostOpenModal.addEventListener("click", ()=> openModal(createPostModal))
closeUpdateUserModal.addEventListener("click", ()=> closeModal(updateUserModalBack))
changeAuthorInfoBtn.addEventListener("click",()=> openModal(updateUserModalBack))
updateProfileInfo.addEventListener("click",() => userUpdateData(userId))
createPostBtn.addEventListener("click", CreatePost);
fetchUsersPosts();
fetchProfileData();
