const apiUrl = "http://localhost:3000/artistas";

// Selecionando os elementos do HTML
const form = document.getElementById("form");

const nomeInput = document.getElementById("artistaNome");
const generoInput = document.getElementById("genero");
const emailInput = document.getElementById("email");
const telefoneInput = document.getElementById("phone");
const biografiaInput = document.getElementById("bio");
const imagemInput = document.getElementById("img");
const artistasListas= document.getElementById("listArtistas");

let editMode = false;
let editId = null;

async function loadArtistas() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayArtistas(data)
    } catch (error) {
        console.error("Erro ao carregar os artistas: ", error)
    } 
}

function displayArtistas(artistas){
    artistasListas.innerHTML = "";

    artistas.forEach(artista => {
        const artistaItem = document.createElement("div");
        artistaItem.classList.add("artista-item");

        artistaItem.innerHTML = ` 
         <img src="${artista.imagem}" />
         <div class="artista-detalhes>
         <h2>${artista.nome}<h2/>
         <p>${artista.biografia}</p>
         <div class="actions">
            <button class="edit-btn" data-id="${artista.id}">Editar</button>
            <button class="delete-btn"data-id="${artista.id}">deletar</button>
        `;

        artistasListas.appendChild(artistaItem)
    });

    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");

    editButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            editArtista(id);
        });
    })

    deleteButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            deleteArtista(id);
        });
    });
}

/**
 * Função para adicionar artista no banco de dados 
 */

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = nomeInput.value.trim();
    const genero = generoInput.value.trim();
    const email = emailInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const biografia = biografiaInput.value.trim();
    const imagem = imagemInput.value.trim();

    if (!nome || !genero || !email || !telefone || !biografia || !imagem) {
        alert("preencha todos os campos!");
        return;
    }

    if (editMode) {
        try {
            await fetch('${apiUrl}/$(editId)', {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({nome, genero, email, telefone, biografia, imagem }),
            });
            alert("Artista atualizado com sucesso!");
        } catch (error) { 
            console.error("Erro ao atualizar!"); 
        }

        editMode = false;
        editId = null;
        submitBtn.textContent = "Adicionar";
    } else {
        try {
            await fetch(apiUrl, {
                method: "POST",
                headers: { "Contenty-type": "application/json"},
                body: JSON.stringify({nome, genero, email, telefone, biografia, imagem}),
            });
            alert("Artista Adicionado com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar artista");
        }

    }
   
//limpar o formulario e carregar a lista
form.reset();
loadArtistas(); 

});

/**Função de editar artista */
function editArtista(id) {
    fetch(`${apiUrl}/${id}`)
    .then((response) => response.json())
    .then((artista) => {
        artista.nomeInput.value = artista.nome;
        artista.generoInput.value = artista.genero;
        artista.emailInput.value = artista.email;
        artista.telefoneInput.value = artista.telefone;
        artista.biografiaInput.value = artista.bioografia;
        artista.imagemInput.value = artista.imagem; 

        editMode = true;
        editId = artista.id;
        submitBtn.textContent = "Atualizar";
    })
    .catch((error) => console.error("Erro ao buscar artista"));

    }

    /**Função deletar */
    async function deleteArtista(id) {
        const confirma = confirm("Tem certeza que deseja deletar o artista?");

        if (!confirma) return;

        try {
            await fetch(`${apiUrl}/${id}`, {
                method: "DELETE"
            });
            alert("Artista deletado com sucesso");
            loadArtistas();
        } catch (error) {
            console.error("Erro ao deletar artista");
        }
    }

    document.addEventListener("DOMContentLoaded", loadArtistas);



