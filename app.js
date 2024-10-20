document.getElementById('scan-btn').addEventListener('click', () => {
    const preview = document.getElementById('preview');
    preview.classList.remove('hidden');

    // Iniciar a leitura do QR code usando QuaggaJS
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            target: preview,
            constraints: {
                facingMode: "environment"
            }
        },
        decoder: {
            readers: ["ean_reader", "code_128_reader", "qr_reader"]
        }
    }, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected((result) => {
        const code = result.codeResult.code;
        console.log("QR Code detectado:", code);

        // Parar a leitura após detecção
        Quagga.stop();

        // Exemplo de objeto de dados extraído do QR code (substituir pela lógica real de parsing)
        const data = {
            geral: {
                chave_acesso: "26240620300157001383651230002341191609509470",
                data_emissao: "2024-06-29T21:09:12-03:00",
                valor_a_pagar: "226.66"
            },
            produtos: [
                { descricao: "LAGARTO BOV RESF MASTERBOI PED kg", quantidade: "1.5320", valor_total: "45.93" },
                { descricao: "MUSC MASTERBOI PED kg", quantidade: "1.0300", valor_total: "30.88" }
            ]
        };

        // Salvar dados no localStorage (simulação para o MVP)
        localStorage.setItem('notaFiscal', JSON.stringify(data));

        // Exibir os dados no frontend
        showInvoiceDetails(data);
    });
});

function showInvoiceDetails(data) {
    document.getElementById('chave-acesso').textContent = data.geral.chave_acesso;
    document.getElementById('data-emissao').textContent = new Date(data.geral.data_emissao).toLocaleString();
    document.getElementById('valor-total').textContent = data.geral.valor_a_pagar;

    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    data.produtos.forEach(produto => {
        const li = document.createElement('li');
        li.textContent = `${produto.descricao} - Quantidade: ${produto.quantidade} - Total: R$${produto.valor_total}`;
        productList.appendChild(li);
    });

    document.getElementById('invoice-details').classList.remove('hidden');
}
