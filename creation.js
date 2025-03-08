// Classe para gerenciar a criação de personagem
class CharacterCreation {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const form = document.getElementById('characterForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Atualiza preview do personagem em tempo real
        document.querySelectorAll('.character-input').forEach(input => {
            input.addEventListener('input', () => this.updateCharacterPreview());
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const character = {
            nome: document.getElementById('charName').value,
            raca: document.getElementById('charRace').value,
            classe: document.getElementById('charClass').value.toLowerCase(),
            idade: parseInt(document.getElementById('charAge').value),
            genero: document.getElementById('charGender').value,
            altura: parseInt(document.getElementById('charHeight').value),
            peso: parseInt(document.getElementById('charWeight').value),
            nivel: 1,
            atributos: {
                forca: parseInt(document.getElementById('attrStr').value) || 10,
                destreza: parseInt(document.getElementById('attrDex').value) || 10,
                constituicao: parseInt(document.getElementById('attrCon').value) || 10,
                inteligencia: parseInt(document.getElementById('attrInt').value) || 10,
                sabedoria: parseInt(document.getElementById('attrWis').value) || 10,
                carisma: parseInt(document.getElementById('attrCha').value) || 10
            },
            combate: {
                pontosVida: parseInt(document.getElementById('charHP').value),
                pontosMana: parseInt(document.getElementById('charMP').value),
                defesa: parseInt(document.getElementById('charDef').value),
                iniciativa: parseInt(document.getElementById('charInit').value)
            },
            historia: {
                background: document.getElementById('charBackground').value,
                alinhamento: document.getElementById('charAlignment').value,
                motivacao: document.getElementById('charMotivation').value,
                fraquezas: document.getElementById('charWeaknesses').value
            },
            dataCriacao: new Date().toISOString()
        };

        console.log('Salvando personagem:', character);
        this.saveCharacter(character);
        this.showSuccessMessage('Personagem criado com sucesso!');
        this.resetForm();
    }

    saveCharacter(character) {
        // Recupera personagens existentes ou inicia array vazio
        let characters = JSON.parse(localStorage.getItem('characters') || '[]');
        characters.push(character);
        localStorage.setItem('characters', JSON.stringify(characters));
        console.log('Personagens salvos:', characters);
    }

    updateCharacterPreview() {
        const previewElement = document.getElementById('characterPreview');
        if (!previewElement) return;

        const nome = document.getElementById('charName').value;
        const raca = document.getElementById('charRace').value;
        const classe = document.getElementById('charClass').value;

        previewElement.innerHTML = `
            <div class="preview-card">
                <h3>Preview do Personagem</h3>
                <p><strong>Nome:</strong> ${nome || 'Indefinido'}</p>
                <p><strong>Raça:</strong> ${raca || 'Indefinido'}</p>
                <p><strong>Classe:</strong> ${classe || 'Indefinido'}</p>
                <p><strong>Nível:</strong> 1</p>
            </div>
        `;
    }

    showSuccessMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success mt-3';
        alertDiv.role = 'alert';
        alertDiv.textContent = message;

        const form = document.getElementById('characterForm');
        form.insertAdjacentElement('beforebegin', alertDiv);

        setTimeout(() => alertDiv.remove(), 3000);
    }

    resetForm() {
        document.getElementById('characterForm').reset();
        this.updateCharacterPreview();
    }
}

// Inicializa a criação de personagem quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new CharacterCreation();
    loadCharacters(); // Carrega personagens salvos ao iniciar
});

// Função para carregar personagens salvos
function loadCharacters() {
    const characters = JSON.parse(localStorage.getItem('characters') || '[]');
    const charactersList = document.getElementById('charactersList');
    
    if (!charactersList) return;

    charactersList.innerHTML = characters.map(char => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${char.nome}</h5>
                <p class="card-text">
                    <strong>Raça:</strong> ${char.raca}<br>
                    <strong>Classe:</strong> ${char.classe}<br>
                    <strong>Nível:</strong> ${char.nivel}
                </p>
                <div class="attributes-summary">
                    <p><strong>Atributos:</strong></p>
                    <ul>
                        <li>FOR: ${char.atributos.forca}</li>
                        <li>DES: ${char.atributos.destreza}</li>
                        <li>CON: ${char.atributos.constituicao}</li>
                        <li>INT: ${char.atributos.inteligencia}</li>
                        <li>SAB: ${char.atributos.sabedoria}</li>
                        <li>CAR: ${char.atributos.carisma}</li>
                    </ul>
                </div>
            </div>
        </div>
    `).join('');
}

// Exporta as funções necessárias
export { CharacterCreation, loadCharacters };
