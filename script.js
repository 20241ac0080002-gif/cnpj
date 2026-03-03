/**
 * Função principal disparada pelo botão "Consultar"
 */
function buscarCNPJ() {
    const inputCnpj = document.getElementById('cnpj').value;
    const cnpjLimpo = inputCnpj.replace(/\D/g, ''); // Remove tudo que não é número
    const resultadoDiv = document.getElementById('resultado');

    // Validação básica
    if (cnpjLimpo.length !== 14) {
        resultadoDiv.innerHTML = '<p class="error-message">Por favor, digite um CNPJ válido com 14 dígitos.</p>';
        return;
    }

    resultadoDiv.innerHTML = '<p>Buscando informações...</p>';

    // Criação de um elemento <script> para contornar o erro de CORS (técnica JSONP)
    // A API Receita WS retornará os dados dentro da função 'callbackCNPJ'
    const script = document.createElement('script');
    script.src = `https://receitaws.com.br/v1/cnpj/${cnpjLimpo}?callback=callbackCNPJ`;
    
    // Adiciona o script ao corpo da página e o remove logo em seguida
    document.body.appendChild(script);
    document.body.removeChild(script);
}

/**
 * Função de Callback que a API executa automaticamente ao retornar os dados
 */
function callbackCNPJ(dados) {
    const resultadoDiv = document.getElementById('resultado');

    // Verifica se a API retornou algum erro interno
    if (dados.status === "ERROR") {
        resultadoDiv.innerHTML = `<p class="error-message">Erro: ${dados.message}</p>`;
        return;
    }

    // Monta o HTML com os dados formatados
    resultadoDiv.innerHTML = `
        <div class="result-card">
            <div class="result-item">
                <strong>Razão Social</strong>
                ${dados.nome}
            </div>
            
            <div class="result-item">
                <strong>Nome Fantasia</strong>
                ${dados.fantasia || 'Não informado'}
            </div>

            <div class="result-item">
                <strong>Situação Cadastral</strong>
                ${dados.situacao}
            </div>

            <div class="result-item">
                <strong>Atividade Principal</strong>
                ${dados.atividade_principal[0].text}
            </div>

            <div class="result-item">
                <strong>Localização</strong>
                ${dados.municipio} - ${dados.uf}
            </div>

            <div class="result-item">
                <strong>Capital Social</strong>
                R$ ${parseFloat(dados.capital_social).toLocaleString('pt-BR')}
            </div>
        </div>
    `;
}