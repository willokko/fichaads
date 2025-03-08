// Função para calcular o modificador de atributo
function calcularModificador(valor) {
    return Math.floor((valor - 10) / 2);
}

// Função para formatar o modificador como string
function formatarModificador(valor) {
    const mod = calcularModificador(valor);
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

// Função para gerar a cor do card baseada na classe
function getClassColor(classe) {
    if (!classe) return 'secondary'; // Retorna uma cor padrão se a classe for undefined ou null

    const cores = {
        'guerreiro': 'danger',
        'mago': 'primary',
        'ladino': 'success',
        'default': 'secondary'
    };
    return cores[classe.toLowerCase()] || cores.default;
}

// Função para carregar e exibir os personagens
function loadCharacters() {
    const characters = JSON.parse(localStorage.getItem('characters') || '[]');
    console.log('Personagens carregados:', characters); // Debug

    const charactersList = document.getElementById('charactersList');
    const noCharactersMessage = document.getElementById('noCharactersMessage');

    if (!charactersList || !noCharactersMessage) {
        console.error('Elementos da DOM não encontrados');
        return;
    }

    if (characters.length === 0) {
        noCharactersMessage.style.display = 'block';
        charactersList.innerHTML = '';
        return;
    }

    noCharactersMessage.style.display = 'none';
    charactersList.innerHTML = characters.map((char, index) => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 border-${getClassColor(char.classe)}">
                <div class="card-header bg-${getClassColor(char.classe)} text-white">
                    <h5 class="card-title mb-0">${char.nome || 'Sem nome'}</h5>
                </div>
                <div class="card-body">
                    <div class="character-info mb-3">
                        <p class="mb-1">
                            <i class="fas fa-user-circle"></i> ${char.raca || 'Raça desconhecida'} 
                            <span class="badge bg-${getClassColor(char.classe)}">${char.classe || 'Sem classe'}</span>
                        </p>
                        <p class="mb-1"><i class="fas fa-star"></i> Nível ${char.nivel || 1}</p>
                    </div>
                    
                    <div class="attributes-grid">
                        <div class="attribute">
                            <span class="attribute-label">FOR</span>
                            <span class="attribute-value">${char.atributos?.forca || 10} (${formatarModificador(char.atributos?.forca || 10)})</span>
                        </div>
                        <div class="attribute">
                            <span class="attribute-label">DES</span>
                            <span class="attribute-value">${char.atributos?.destreza || 10} (${formatarModificador(char.atributos?.destreza || 10)})</span>
                        </div>
                        <div class="attribute">
                            <span class="attribute-label">CON</span>
                            <span class="attribute-value">${char.atributos?.constituicao || 10} (${formatarModificador(char.atributos?.constituicao || 10)})</span>
                        </div>
                        <div class="attribute">
                            <span class="attribute-label">INT</span>
                            <span class="attribute-value">${char.atributos?.inteligencia || 10} (${formatarModificador(char.atributos?.inteligencia || 10)})</span>
                        </div>
                        <div class="attribute">
                            <span class="attribute-label">SAB</span>
                            <span class="attribute-value">${char.atributos?.sabedoria || 10} (${formatarModificador(char.atributos?.sabedoria || 10)})</span>
                        </div>
                        <div class="attribute">
                            <span class="attribute-label">CAR</span>
                            <span class="attribute-value">${char.atributos?.carisma || 10} (${formatarModificador(char.atributos?.carisma || 10)})</span>
                        </div>
                    </div>

                    <div class="combat-info mt-3">
                        <p class="mb-1">
                            <i class="fas fa-heart text-danger"></i> HP: ${char.combate?.pontosVida || 0}
                            <i class="fas fa-fire-alt text-primary ms-2"></i> MP: ${char.combate?.pontosMana || 0}
                        </p>
                        <p class="mb-1">
                            <i class="fas fa-shield-alt text-secondary"></i> DEF: ${char.combate?.defesa || 0}
                            <i class="fas fa-bolt text-warning ms-2"></i> INI: ${char.combate?.iniciativa || 0}
                        </p>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-sm btn-danger" onclick="deleteCharacter(${index})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="viewCharacterDetails(${index})">
                        <i class="fas fa-eye"></i> Detalhes
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Função para excluir um personagem
window.deleteCharacter = function(index) {
    if (confirm('Tem certeza que deseja excluir este personagem?')) {
        const characters = JSON.parse(localStorage.getItem('characters') || '[]');
        characters.splice(index, 1);
        localStorage.setItem('characters', JSON.stringify(characters));
        loadCharacters();
    }
};

// Função para visualizar detalhes do personagem
window.viewCharacterDetails = function(index) {
    const characters = JSON.parse(localStorage.getItem('characters') || '[]');
    const char = characters[index];
    
    if (!char) {
        console.error('Personagem não encontrado');
        return;
    }

    const modalHtml = `
        <div class="modal fade" id="characterModal${index}" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-${getClassColor(char.classe)} text-white">
                        <h5 class="modal-title">${char.nome || 'Sem nome'}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body bg-light">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="card h-100">
                                    <div class="card-header bg-dark text-white">
                                        <h6 class="mb-0"><i class="fas fa-user-circle"></i> Informações Básicas</h6>
                                    </div>
                                    <div class="card-body">
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item d-flex justify-content-between">
                                                <strong class="text-dark">Idade:</strong>
                                                <span class="text-secondary">${char.idade || 'N/A'} anos</span>
                                            </li>
                                            <li class="list-group-item d-flex justify-content-between">
                                                <strong class="text-dark">Gênero:</strong>
                                                <span class="text-secondary">${char.genero || 'N/A'}</span>
                                            </li>
                                            <li class="list-group-item d-flex justify-content-between">
                                                <strong class="text-dark">Altura:</strong>
                                                <span class="text-secondary">${char.altura || 'N/A'}cm</span>
                                            </li>
                                            <li class="list-group-item d-flex justify-content-between">
                                                <strong class="text-dark">Peso:</strong>
                                                <span class="text-secondary">${char.peso || 'N/A'}kg</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card h-100">
                                    <div class="card-header bg-dark text-white">
                                        <h6 class="mb-0"><i class="fas fa-book-open"></i> História</h6>
                                    </div>
                                    <div class="card-body">
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item">
                                                <strong class="text-dark d-block mb-1">Alinhamento:</strong>
                                                <span class="text-secondary">${char.historia?.alinhamento || 'N/A'}</span>
                                            </li>
                                            <li class="list-group-item">
                                                <strong class="text-dark d-block mb-1">Background:</strong>
                                                <span class="text-secondary">${char.historia?.background || 'N/A'}</span>
                                            </li>
                                            <li class="list-group-item">
                                                <strong class="text-dark d-block mb-1">Motivação:</strong>
                                                <span class="text-secondary">${char.historia?.motivacao || 'N/A'}</span>
                                            </li>
                                            <li class="list-group-item">
                                                <strong class="text-dark d-block mb-1">Fraquezas:</strong>
                                                <span class="text-secondary">${char.historia?.fraquezas || 'N/A'}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-header bg-dark text-white">
                                        <h6 class="mb-0"><i class="fas fa-dice-d20"></i> Atributos e Combate</h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <h6 class="text-dark mb-3">Atributos</h6>
                                                <div class="attributes-grid-modal">
                                                    <div class="attribute-item">
                                                        <span class="badge bg-secondary mb-1">FOR</span>
                                                        <span class="text-dark">${char.atributos?.forca || 10} (${formatarModificador(char.atributos?.forca || 10)})</span>
                                                    </div>
                                                    <div class="attribute-item">
                                                        <span class="badge bg-secondary mb-1">DES</span>
                                                        <span class="text-dark">${char.atributos?.destreza || 10} (${formatarModificador(char.atributos?.destreza || 10)})</span>
                                                    </div>
                                                    <div class="attribute-item">
                                                        <span class="badge bg-secondary mb-1">CON</span>
                                                        <span class="text-dark">${char.atributos?.constituicao || 10} (${formatarModificador(char.atributos?.constituicao || 10)})</span>
                                                    </div>
                                                    <div class="attribute-item">
                                                        <span class="badge bg-secondary mb-1">INT</span>
                                                        <span class="text-dark">${char.atributos?.inteligencia || 10} (${formatarModificador(char.atributos?.inteligencia || 10)})</span>
                                                    </div>
                                                    <div class="attribute-item">
                                                        <span class="badge bg-secondary mb-1">SAB</span>
                                                        <span class="text-dark">${char.atributos?.sabedoria || 10} (${formatarModificador(char.atributos?.sabedoria || 10)})</span>
                                                    </div>
                                                    <div class="attribute-item">
                                                        <span class="badge bg-secondary mb-1">CAR</span>
                                                        <span class="text-dark">${char.atributos?.carisma || 10} (${formatarModificador(char.atributos?.carisma || 10)})</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <h6 class="text-dark mb-3">Combate</h6>
                                                <ul class="list-group">
                                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                                        <span><i class="fas fa-heart text-danger"></i> Pontos de Vida</span>
                                                        <span class="badge bg-danger">${char.combate?.pontosVida || 0}</span>
                                                    </li>
                                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                                        <span><i class="fas fa-fire-alt text-primary"></i> Pontos de Mana</span>
                                                        <span class="badge bg-primary">${char.combate?.pontosMana || 0}</span>
                                                    </li>
                                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                                        <span><i class="fas fa-shield-alt text-success"></i> Defesa</span>
                                                        <span class="badge bg-success">${char.combate?.defesa || 0}</span>
                                                    </li>
                                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                                        <span><i class="fas fa-bolt text-warning"></i> Iniciativa</span>
                                                        <span class="badge bg-warning">${char.combate?.iniciativa || 0}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Adiciona o modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Mostra o modal
    const modal = new bootstrap.Modal(document.getElementById(`characterModal${index}`));
    modal.show();
    
    // Remove o modal do DOM quando for fechado
    document.getElementById(`characterModal${index}`).addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
};

// Carrega os personagens quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, iniciando carregamento dos personagens');
    loadCharacters();
}); 