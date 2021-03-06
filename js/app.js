const loading = document.querySelector(".loading")


class Github {
    constructor() {
        this.client_id = "0c118fed9f896c8380e2"
        this.client_secret = "06fc524c965a6771d0eef189d15f77eb4cb81295"
        this.base = "https://api.github.com/users/"
    }

    async ajaxUser(userValue) {   //User url

        loading.classList.add("showItem")

        const userURL = `${this.base}${userValue}?client_id='${this.client_id}'&client_secret='${this.client_secret}`
        
        //get Users
        const userData = await fetch(userURL)
        const user = await userData.json()

        return {
            user
        };


    }

    async ajaxRepos(userValue) {   //User url

        //Repos URL
        const reposURL = `${this.base}${userValue}/repos?client_id='${this.client_id}'&client_secret='${this.client_secret}`

        //get Repos
        const reposData = await fetch(reposURL)
        const repos = await reposData.json()

        return {
            repos
        };


    }
}

class UI {
    constructor() {

    }

    //SHOW FEEDBACK
    showFeedback(text) {
        const feedback = document.querySelector(".feedback")
        feedback.classList.add("showItem")
        feedback.innerHTML = `<p>${text}</p>`
        setTimeout(() => {
            feedback.classList.remove("showItem")
        }, 3000)
    }

    //get User
    getUser(user) {
        const { avatar_url: image, html_url: link, public_repos: repos, name, login, message } = user

        if (message === "Not Found") {
            loading.classList.remove("showItem")
            this.showFeedback("No such user exists")
        }
        else {
            this.displayUser(image, link, repos, name, login)
            const searchUser = document.getElementById("searchUser")
            searchUser.value = ""
        }
    }

    displayUser(image, link, repos, name, login) {
        
        loading.classList.remove("showItem")
        // console.log(image,link,repos,name,login)
        const userList = document.getElementById("github-users")
        userList.insertAdjacentHTML("afterbegin", ` <div class="row single-user my-3">
        <div class=" col-sm-6 col-md-4 user-photo my-2">
        <img src="${image}" class="img-fluid" alt="">
       </div>
       <div class="col-sm-6 col-md-4 user-info text-capitalize my-2">
        <h6>name : <span>${name}</span></h6>
        <h6>github : <a href="${link}" class="badge badge-primary">Link</a> </h6>
        <h6>public repos : <span class="badge badge-success">${repos}</span> </h6>
       </div>
       <div class=" col-sm-6 col-md-4 user-repos my-2">
        <button type="button" data-id=${login} id="getRepos" class="btn reposBtn text-capitalize mt-3">
         get repos
        </button>
       </div> `)

       userList.appendChild(div)
    }

    displayRepos(userID,repos)
    {  
        const reposBtn = document.querySelectorAll("[data-id]")
        reposBtn.forEach(btn=>{
            if(btn.dataset.id === userID)
            {
                const parent = btn.parentNode

                repos.forEach(repo=>{
                    const p = document.createElement("p")
                    p.innerHTML = `<p><a href = "${repo.html_url}" target="_blank">${repo.name}</a></p>`
                    parent.appendChild(p)
                })
            }
        })
    }

}

(function () {
    const ui = new UI()
    const github = new Github

    const searchForm = document.getElementById("searchForm")
    const searchUser = document.getElementById("searchUser")
    const userList = document.getElementById("github-users")

    searchForm.addEventListener("submit", (event) => {

        event.preventDefault()

        const textValue = searchUser.value

        if (textValue === "") {
            ui.showFeedback("PLease Enter a Valid UserName")
        }
        else {
            github.ajaxUser(textValue).then(data => ui.getUser(data.user)).catch(error => console.log(error))
        }
    })

    //UserList
    userList.addEventListener("click",function(event){
      if(event.target.classList.contains("reposBtn"))
      {
          const userID = event.target.dataset.id
          github.ajaxRepos(userID).then(data=>ui.displayRepos(userID,data.repos)).catch(error=>console.log(error))
      }

    })

})()