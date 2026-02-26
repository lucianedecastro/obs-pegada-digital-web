const API_BASE_URL = "http://localhost:8080/api/calculo";

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
        // Chamada ao Endpoint da Verdade da sua API [cite: 56]
        const response = await fetch(`${API_BASE_URL}/evitado?slug=${material}&peso=${peso}`);
        
        if (!response.ok) throw new Error("Falha na conexão com a API");

        const data = await response.json();

        // Renderização do Selo de Confiança dinâmico no Dashboard [cite: 119, 120]
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
                    Hash de Integridade: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </p>
            </div>
        `;

    } catch (error) {
        console.error(error);
        alert("Erro: Certifique-se que o Backend (IntelliJ) está rodando e o CORS está habilitado!");
    }
}

/**
 * Função para gerar o Relatório Auditável (PDF) [cite: 101, 111]
 * Ajustada para criar um documento oficial "Clean Print" (Fundo branco/Texto preto)
 */
function gerarRelatorio() {
    const elementoOriginal = document.getElementById('resultado');
    const material = document.getElementById('material').value;
    
    // 1. Criamos um clone para estilizar sem alterar o visual neon do Dashboard
    const clone = elementoOriginal.cloneNode(true);
    
    // 2. Removemos o botão de download dentro do clone para não sair no papel
    const botaoNoClone = clone.querySelector('button');
    if (botaoNoClone) botaoNoClone.remove();

    // 3. Aplicamos estilos de "Documento Oficial" (Preto e Branco) ao clone
    Object.assign(clone.style, {
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '30px',
        border: '1px solid #000000',
        borderRadius: '0',
        boxShadow: 'none',
        display: 'block'
    });

    // Ajusta cores de todos os textos internos do clone para preto
    clone.querySelectorAll('p, h3, small, div').forEach(el => {
        el.style.color = '#000000';
    });

    // 4. Configurações de saída do PDF
    const opcoes = {
        margin: 15,
        filename: `Relatorio_Auditoria_${material}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
            scale: 3, 
            backgroundColor: '#ffffff',
            useCORS: true,
            letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Gera o PDF a partir do clone formatado
    html2pdf().set(opcoes).from(clone).save();
}

document.getElementById('btn-calcular').addEventListener('click', calcular);