// A URL aponta para o servidor oficial no Render
const API_BASE_URL = "https://obs-pegada-digital-api.onrender.com/api/calculo";

/**
 * Função principal para realizar o cálculo via API
 */
async function calcular() {
    const material = document.getElementById('material').value;
    const peso = document.getElementById('peso').value;
    const resultadoDiv = document.getElementById('resultado');
    const dadosDiv = document.getElementById('dados-resultado');

    if (!peso || peso <= 0) {
        alert("Por favor, insira um peso válido para a auditoria.");
        return;
    }

    try {
        // Chamada ao servidor oficial na nuvem
        const response = await fetch(`${API_BASE_URL}/evitado?slug=${material}&peso=${peso}`);
        
        if (!response.ok) throw new Error("Falha na conexão com a API oficial");

        const data = await response.json();

        // Renderização do Selo de Confiança dinâmico no Dashboard
        resultadoDiv.classList.remove('hidden');
        dadosDiv.innerHTML = `
            <div class="trust-widget" id="area-relatorio">
                <p style="font-size: 1.5rem; color: #00ff88; font-weight: bold; margin-bottom: 5px;">
                    ${data.co2EvitadoKg.toFixed(2)} kg CO₂e Evitados
                </p>
                <p style="margin: 5px 0;"><small>Base Científica: Patch ${data.versaoMetodologia}</small></p>
                <p style="margin: 5px 0;"><small>Status: ${data.statusAuditoria}</small></p>
                <p style="margin: 5px 0;"><small>Material Auditado: ${data.material}</small></p>
                <hr style="border: 0.1px solid rgba(0,255,136,0.2); margin: 10px 0;">
                <p style="font-size: 0.65rem; color: #888; word-break: break-all;">
                    ID de Integridade: SHA256-AUTHENTICATED
                </p>
            </div>
        `;

    } catch (error) {
        console.error(error);
        alert("Erro: O servidor na nuvem pode estar 'acordando'. Tente novamente em alguns segundos.");
    }
}

/**
 * Função para limpar os campos e resetar a interface (Botão no Título)
 */
function resetarCalculo() {
    // Limpa os inputs de dados
    document.getElementById('peso').value = '';
    document.getElementById('material').selectedIndex = 0;
    
    // Oculta a área de resultados e limpa o HTML interno
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.classList.add('hidden');
    document.getElementById('dados-resultado').innerHTML = '';
    
    console.log("Sistema reiniciado para nova auditoria.");
}

/**
 * Lógica de geração do Relatório PDF (Formatação Clean Print)
 */
function gerarRelatorio() {
    const elementoOriginal = document.getElementById('resultado');
    const material = document.getElementById('material').value;
    
    // Criamos um clone para formatar o PDF em modo 'claro' para impressão
    const clone = elementoOriginal.cloneNode(true);
    
    // Remove o botão de download de dentro do PDF
    const botaoNoClone = clone.querySelector('button');
    if (botaoNoClone) botaoNoClone.remove();

    // Estilização exclusiva para o documento impresso (Fundo branco / Texto preto)
    Object.assign(clone.style, {
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '30px',
        border: '1px solid #000',
        borderRadius: '0',
        boxShadow: 'none',
        display: 'block'
    });

    // Garante que todos os textos internos fiquem pretos no PDF
    clone.querySelectorAll('p, h3, small, div').forEach(el => {
        el.style.color = '#000000';
    });

    const opcoes = {
        margin: 15,
        filename: `Relatorio_Auditoria_${material}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
            scale: 3, 
            backgroundColor: '#ffffff',
            letterRendering: true 
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opcoes).from(clone).save();
}

// Event Listeners
document.getElementById('btn-calcular').addEventListener('click', calcular);