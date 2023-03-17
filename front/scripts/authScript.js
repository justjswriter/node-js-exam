const regFullName = document.querySelector("#reg_full_name")
const regLogin = document.querySelector("#reg_login")
const regPassword = document.querySelector("#reg_password")
const regUserBtn = document.querySelector("#reg_user_btn")


const logLogin = document.querySelector("#log_login")
const logPassword = document.querySelector("#log_password")
const logUserBtn = document.querySelector("#log_user_btn")


const registrationForm = document.querySelector(".registration_form")
const loginForm = document.querySelector(".login_form")

const BASE_URL = "http://localhost:8080";

const fetchData = async (route) => {
    const response = await fetch(BASE_URL + route);
    return await response.json();
};

const postData = async (route, payload) => {
    const result = await fetch(
        BASE_URL + route, 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: payload,
        },
    );
    return result.json();
};

const logOut = () => {
    localStorage.clear();
    window.location.href = `index.html`;
}

const userRegistration = async () =>{
    const userInfoPayload  = {
            fullName: regFullName.value,
            login: regLogin.value,
            password: regPassword.value
    };
    const result = await fetchData(`/users`);
    const copyCheck = result.find((user) => user.login === regLogin.value)
    if(!copyCheck){
        let jsonPaylod = JSON.stringify(userInfoPayload)
        postData("/users", jsonPaylod)
    }else{
        alert("Логин уже занят!")
    }
}

const userLogin = async () => {
    const userLoginPayload  = {
        login: logLogin.value,
        password: logPassword.value
    };
    const jsonPayload = JSON.stringify(userLoginPayload)
    const result = await postData("/users/auth", jsonPayload)
    if(result.length == 0){
        alert("Неправильный логин или пароль")
    }else{
        localStorage.setItem("user", JSON.stringify(result[0]._id))
        window.location.href = `feed.html`;
    }

}

const changeWindow= (form, newForm) => {
    form.style.display = "none"
    newForm.style.display = "flex"
}

logUserBtn.addEventListener("click", userLogin)
regUserBtn.addEventListener("click", userRegistration)

