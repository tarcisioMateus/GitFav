import { GitUser } from "./gituser.js"

export class Favorite {
  
    constructor (root) {
        this.root = document.querySelector(root)

        this.load ()
    }

    load () {
        this.entries = JSON.parse(localStorage.getItem("@GitFav:")) || []   
    }

    save () {
        localStorage.setItem("@GitFav:", JSON.stringify(this.entries))
    }

    async add (login) {
        try {
            const found = this.entries.find((user) => user.login.toLowerCase() == login.toLowerCase())
            if (found) {
                throw new Error(`${login} já está cadastrado!`)
            }

            const user = await GitUser.search(login)

            const nonExistent = user.name == undefined
            if (nonExistent) {
                throw new Error(`${login} não existe!`)
            }

            this.entries = [user, ...this.entries]
            this.save()
        } catch (error) {
            alert(error.message)
        }
    }

    delete (login) {
        const itsOkay = window.confirm(`tem certeza q quer REMOVER ${login}?`)

        if (itsOkay) {
            this.entries = this.entries.filter( (user) => user.login != login)
            this.save()
        }
    }
}

export class FavoriteView extends Favorite{

    constructor (root) {
        super(root) 

        this.tbody = this.root.querySelector('tbody')

        this.root.querySelector("#search button").onclick = () => this.addingUser ()

        this.update()
    }

    async addingUser () {
        const {value} = this.root.querySelector("#search input")
        await this.add(value)
        this.update ()
    }

    update () {
        this.removeRows()
        
        this.entries.forEach((user) => this.addRow(user))
        
        if (this.entries.length == 0) {
            this.addEmptyRow()
        }
    }

    addRow (user) {
        const row = this.createRow()

        row.querySelector(".user img").src = `https://github.com/${user.login}.png`
        row.querySelector(".user img").alt = `photo de ${user.name}`
        row.querySelector(".user a").href = `https://github.com/${user.login}`
        row.querySelector(".user .name").textContent = user.name
        row.querySelector(".user .login").textContent = `/${user.login}`

        row.querySelector(".public-repos").textContent = user.public_repos
        row.querySelector(".followers").textContent = user.followers

        row.querySelector(".remove button").onclick = () => {
            this.delete(user.login)
            this.update()
        }

        this.tbody.append(row)
        if ( !this.tbody.classList.contains("scroll") ) {
            this.tbody.classList.add("scroll")
        }
            
    }
    createRow () {
        const row = document.createElement('tr')

        row.innerHTML = `
        <td>
                        
            <div class="user">
                <img src="" alt="" />

                <a href="" target="_blank">
                    <p class="name"></p>
                    <span class="login"></span>
                </a>
            </div>
            
        </td>
        <td class="public-repos"></td>
        <td class="followers"></td>
        <td class="remove">
            <button>Remover</button>
        </td>`

        return row
    }

    addEmptyRow () {
        const tr = document.createElement('tr')
        tr.id = "empty-row"

        tr.innerHTML = `<td></td>
                    <td></td>
                    <td></td>
                    <td></td>`

        this.tbody.append(tr)
        this.tbody.classList.remove("scroll")
    }

    removeRows () {
        this.tbody.innerHTML = ""
    }
}