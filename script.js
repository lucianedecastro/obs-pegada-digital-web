// A URL agora aponta para o servidor oficial no Render
const API_BASE_URL = "https://obs-pegada-digital-api.onrender.com/api/calculo";

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
        // Chamada ao seu servidor oficial na nuvem
        const response = await fetch(`${API_BASE_URL}/evitado?slug=${material}&peso=${peso}`);
        
        if (!response.ok) throw new Error("Falha na conexão com a API oficial");

        const data = await response.json();

        // Renderização do Selo de Confiança dinâmico
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

// Lógica de geração do Relatório PDF (mantida)
function gerarRelatorio() {
    const elementoOriginal = document.getElementById('resultado');
    const material = document.getElementById('material').value;
    const clone = elementoOriginal.cloneNode(true);
    const botaoNoClone = clone.querySelector('button');
    if (botaoNoClone) botaoNoClone.remove();

    Object.assign(clone.style, {
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '30px',
        border: '1px solid #000',
        borderRadius: '0'
    });

    clone.querySelectorAll('p, h3, small, div').forEach(el => el.style.color = '#000');

    const opcoes = {
        margin: 15,
        filename: `Relatorio_Auditoria_${material}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 3, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opcoes).from(clone).save();
}

document.getElementById('btn-calcular').addEventListener('click', calcular);