document.addEventListener('DOMContentLoaded', function() {
    const storageInput = document.getElementById('storageInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const costResult = document.getElementById('costResult');
    const continuityResult = document.getElementById('continuityResult');
    const optimalResult = document.getElementById('optimalResult');
    const derivativeResult = document.getElementById('derivativeResult');
    
    let costChart;
    
    // Fungsi piecewise untuk menghitung biaya
    function calculateCost(x) {
        if (x <= 50) {
            return 50000 + Math.max(0, (x - 50)) * 2000;
        } else if (x <= 200) {
            return 90000 + Math.max(0, (x - 200)) * 2000;
        } else {
            return 150000 + Math.max(0, (x - 500)) * 2000;
        }
    }
    
    // Fungsi untuk menentukan paket optimal
    function findOptimalPackage(x) {
        const basicCost = calculateCostWithPackage(x, 'basic');
        const standardCost = calculateCostWithPackage(x, 'standard');
        const premiumCost = calculateCostWithPackage(x, 'premium');
        
        const costs = [
            { name: 'Basic', cost: basicCost },
            { name: 'Standard', cost: standardCost },
            { name: 'Premium', cost: premiumCost }
        ];
        
        // Urutkan dari biaya terendah
        costs.sort((a, b) => a.cost - b.cost);
        
        return costs;
    }
    
    // Fungsi untuk menghitung biaya dengan paket tertentu
    function calculateCostWithPackage(x, package) {
        switch(package) {
            case 'basic':
                return 50000 + Math.max(0, (x - 50)) * 2000;
            case 'standard':
                return 90000 + Math.max(0, (x - 200)) * 2000;
            case 'premium':
                return 150000 + Math.max(0, (x - 500)) * 2000;
            default:
                return 0;
        }
    }
    
    // Fungsi untuk menganalisis kekontinuan
    function analyzeContinuity() {
        // Di x = 50
        const leftLimit50 = calculateCostWithPackage(50, 'basic');
        const rightLimit50 = calculateCostWithPackage(50, 'standard');
        
        // Di x = 200
        const leftLimit200 = calculateCostWithPackage(200, 'standard');
        const rightLimit200 = calculateCostWithPackage(200, 'premium');
        
        return {
            x50: { left: leftLimit50, right: rightLimit50, continuous: leftLimit50 === rightLimit50 },
            x200: { left: leftLimit200, right: rightLimit200, continuous: leftLimit200 === rightLimit200 }
        };
    }
    
    // Fungsi untuk menghitung turunan
    function calculateDerivative() {
        return [
            { interval: '0 ≤ x ≤ 50', derivative: 0 },
            { interval: '50 < x ≤ 200', derivative: 0 },
            { interval: '200 < x ≤ 500', derivative: 0 },
            { interval: 'x > 500', derivative: 2000 }
        ];
    }
    
    // Fungsi untuk memperbarui grafik
    function updateChart() {
        const ctx = document.getElementById('costChart').getContext('2d');
        
        // Hapus chart sebelumnya jika ada
        if (costChart) {
            costChart.destroy();
        }
        
        // Data untuk grafik
        const labels = Array.from({length: 601}, (_, i) => i); // 0 hingga 600
        const basicData = labels.map(x => calculateCostWithPackage(x, 'basic'));
        const standardData = labels.map(x => calculateCostWithPackage(x, 'standard'));
        const premiumData = labels.map(x => calculateCostWithPackage(x, 'premium'));
        
        // Buat grafik
        costChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Paket Basic',
                        data: basicData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'Paket Standard',
                        data: standardData,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'Paket Premium',
                        data: premiumData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Penyimpanan (GB)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Biaya (Rp)'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'Rp ' + value.toLocaleString('id-ID');
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': Rp ' + context.raw.toLocaleString('id-ID');
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Fungsi untuk memperbarui tampilan
    function updateUI() {
        const storage = parseInt(storageInput.value);
        
        // Validasi input
        if (isNaN(storage) || storage < 0 || storage > 600) {
            alert('Masukkan jumlah penyimpanan antara 0 dan 600 GB');
            return;
        }
        
        // Hitung biaya untuk setiap paket
        const optimalPackages = findOptimalPackage(storage);
        const continuity = analyzeContinuity();
        const derivatives = calculateDerivative();
        
        // Tampilkan hasil
        costResult.innerHTML = `
            <h3>Biaya untuk ${storage} GB:</h3>
            <p>Basic: Rp ${calculateCostWithPackage(storage, 'basic').toLocaleString('id-ID')}</p>
            <p>Standard: Rp ${calculateCostWithPackage(storage, 'standard').toLocaleString('id-ID')}</p>
            <p>Premium: Rp ${calculateCostWithPackage(storage, 'premium').toLocaleString('id-ID')}</p>
        `;
        
        continuityResult.innerHTML = `
            <h3>Analisis Kekontinuan:</h3>
            <p>Pada x = 50: Limit kiri = Rp ${continuity.x50.left.toLocaleString('id-ID')}, 
            Limit kanan = Rp ${continuity.x50.right.toLocaleString('id-ID')}, 
            ${continuity.x50.continuous ? 'Kontinu' : 'Tidak Kontinu'}</p>
            <p>Pada x = 200: Limit kiri = Rp ${continuity.x200.left.toLocaleString('id-ID')}, 
            Limit kanan = Rp ${continuity.x200.right.toLocaleString('id-ID')}, 
            ${continuity.x200.continuous ? 'Kontinu' : 'Tidak Kontinu'}</p>
        `;
        
        optimalResult.innerHTML = `
            <h3>Rekomendasi Paket Optimal:</h3>
            <ol>
                <li>${optimalPackages[0].name}: Rp ${optimalPackages[0].cost.toLocaleString('id-ID')}</li>
                <li>${optimalPackages[1].name}: Rp ${optimalPackages[1].cost.toLocaleString('id-ID')}</li>
                <li>${optimalPackages[2].name}: Rp ${optimalPackages[2].cost.toLocaleString('id-ID')}</li>
            </ol>
        `;
        
        derivativeResult.innerHTML = `
            <h3>Analisis Turunan (Bonus):</h3>
            <p>Turunan fungsi C(x) untuk setiap interval:</p>
            <ul>
                ${derivatives.map(d => `<li>${d.interval}: C'(x) = ${d.derivative}</li>`).join('')}
            </ul>
            <p>Turunan = 0 artinya biaya tidak berubah terhadap penambahan penyimpanan (dalam interval tersebut).</p>
            <p>Turunan = 2000 artinya setiap penambahan 1 GB penyimpanan akan menambah biaya sebesar Rp 2.000.</p>
        `;
        
        // Perbarui grafik
        updateChart();
    }
    
    // Event listener untuk tombol hitung
    calculateBtn.addEventListener('click', updateUI);
    
    // Inisialisasi pertama kali
    updateUI();
});