// ============================================
// KONFIGURASI - GANTI URL INI!
// ============================================
const CONFIG = {
    // Ganti dengan Web App URL dari Google Apps Script Anda
    SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxSqaANveC567cMCuXUdjffLm_p1Q1ilmsXNTXayJZfHg85sS2EkY-YS3R8OHyC52tu/exec',
    // Contoh: 'https://script.google.com/macros/s/AKfycbx.../exec'
};

// ============================================
// INISIALISASI ELEMEN
// ============================================
const form = document.getElementById('laporanForm');
const alertBox = document.getElementById('alertBox');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const loading = document.getElementById('loading');

// Dropdown elements
const namaPengaduSelect = document.getElementById('namaPengadu');
const namaPelanggarSelect = document.getElementById('namaPelanggar');

// Input fields
const areaInput = document.getElementById('area');
const laporanInput = document.getElementById('laporan');

// ============================================
// FUNGSI UTILITY
// ============================================

/**
 * Menampilkan alert/notifikasi
 */
function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.style.display = 'block';
    
    setTimeout(() => {
        hideAlert();
    }, 5000);
    
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Menyembunyikan alert
 */
function hideAlert() {
    alertBox.style.display = 'none';
}

/**
 * Validasi URL Google Apps Script
 */
function validateScriptURL() {
    if (CONFIG.SCRIPT_URL === 'GANTI_DENGAN_URL_GOOGLE_APPS_SCRIPT_ANDA') {
        showAlert('⚠️ KONFIGURASI BELUM SELESAI! Mohon ganti SCRIPT_URL di file script.js dengan URL Google Apps Script Anda.', 'warning');
        return false;
    }
    
    if (!CONFIG.SCRIPT_URL.includes('script.google.com')) {
        showAlert('⚠️ URL Google Apps Script tidak valid! Pastikan URL mengandung "script.google.com"', 'error');
        return false;
    }
    
    return true;
}

/**
 * Validasi form input
 */
function validateForm() {
    const namaPengadu = namaPengaduSelect.value;
    const namaPelanggar = namaPelanggarSelect.value;
    const area = areaInput.value.trim();
    const laporan = laporanInput.value.trim();
    
    if (namaPengadu === '') {
        showAlert('❌ Nama Pengadu harus dipilih!', 'error');
        namaPengaduSelect.focus();
        return false;
    }
    
    if (namaPelanggar === '') {
        showAlert('❌ Nama Pelanggar harus dipilih!', 'error');
        namaPelanggarSelect.focus();
        return false;
    }
    
    if (namaPengadu === namaPelanggar) {
        showAlert('❌ Nama Pengadu dan Pelanggar tidak boleh sama!', 'error');
        namaPelanggarSelect.focus();
        return false;
    }
    
    if (area === '') {
        showAlert('❌ Area/Lantai tidak boleh kosong!', 'error');
        areaInput.focus();
        return false;
    }
    
    if (laporan === '') {
        showAlert('❌ Detail Pelanggaran tidak boleh kosong!', 'error');
        laporanInput.focus();
        return false;
    }
    
    if (laporan.length < 10) {
        showAlert('❌ Detail Pelanggaran minimal 10 karakter!', 'error');
        laporanInput.focus();
        return false;
    }
    
    return true;
}

/**
 * Mengubah status loading
 */
function setLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.textContent = 'Mengirim...';
        loading.style.display = 'block';
    } else {
        submitBtn.disabled = false;
        btnText.textContent = 'Kirim Laporan';
        loading.style.display = 'none';
    }
}

/**
 * Reset form
 */
function resetForm() {
    form.reset();
}

/**
 * Format tanggal ke timezone Jakarta
 */
function getJakartaTimestamp() {
    return new Date().toISOString();
}

// ============================================
// FUNGSI LOAD NAMA PETUGAS
// ============================================

/**
 * Load daftar nama dari Google Sheets
 */
async function loadNamaList() {
    try {
        if (!validateScriptURL()) {
            return;
        }

        const response = await fetch(`${CONFIG.SCRIPT_URL}?action=getNames`, {
            method: 'GET',
        });

        const data = await response.json();

        if (data.success && data.names && data.names.length > 0) {
            populateDropdowns(data.names);
        } else {
            console.warn('Tidak ada data nama, atau sheet Daftar_Petugas kosong');
            showAlert('⚠️ Daftar nama belum tersedia. Hubungi administrator.', 'warning');
        }

    } catch (error) {
        console.error('Error loading names:', error);
        showAlert('⚠️ Gagal memuat daftar nama. Silakan refresh halaman.', 'warning');
    }
}

/**
 * Populate dropdown dengan nama
 */
function populateDropdowns(names) {
    // Clear existing options (except placeholder)
    namaPengaduSelect.innerHTML = '<option value="">-- Pilih Nama Anda --</option>';
    namaPelanggarSelect.innerHTML = '<option value="">-- Pilih Nama Pelanggar --</option>';

    // Add names to both dropdowns
    names.forEach(name => {
        // For Pengadu
        const option1 = document.createElement('option');
        option1.value = name;
        option1.textContent = name;
        namaPengaduSelect.appendChild(option1);

        // For Pelanggar
        const option2 = document.createElement('option');
        option2.value = name;
        option2.textContent = name;
        namaPelanggarSelect.appendChild(option2);
    });

    console.log('✅ Loaded', names.length, 'names');
}

// ============================================
// FUNGSI PENGIRIMAN DATA
// ============================================

/**
 * Kirim data ke Google Apps Script
 */
async function sendDataToGoogleSheets(formData) {
    try {
        const response = await fetch(CONFIG.SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        return { success: true };
        
    } catch (error) {
        console.error('Error mengirim data:', error);
        throw error;
    }
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handler untuk submit form
 */
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    hideAlert();
    
    if (!validateScriptURL()) {
        return;
    }
    
    if (!validateForm()) {
        return;
    }
    
    // Siapkan data
    const formData = {
        type: 'laporan-pelanggaran',
        namaPengadu: namaPengaduSelect.value,
        namaPelanggar: namaPelanggarSelect.value,
        area: areaInput.value.trim(),
        laporan: laporanInput.value.trim(),
        timestamp: getJakartaTimestamp()
    };
    
    setLoading(true);
    
    try {
        await sendDataToGoogleSheets(formData);
        
        showAlert('✅ Laporan berhasil dikirim! Terima kasih atas laporan Anda.', 'success');
        
        setTimeout(() => {
            resetForm();
        }, 1000);
        
    } catch (error) {
        showAlert('❌ Terjadi kesalahan saat mengirim laporan. Silakan coba lagi atau hubungi administrator.', 'error');
        console.error('Error:', error);
        
    } finally {
        setLoading(false);
    }
});

/**
 * Auto-hide alert saat user mulai input
 */
form.addEventListener('input', () => {
    if (alertBox.style.display === 'block') {
        hideAlert();
    }
});

/**
 * Prevent multiple spaces di input text
 */
[areaInput, laporanInput].forEach(input => {
    input.addEventListener('input', function() {
        this.value = this.value.replace(/\s+/g, ' ');
    });
});

// ============================================
// INISIALISASI
// ============================================

/**
 * Fungsi yang dijalankan saat halaman dimuat
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Form Laporan Pelanggaran siap digunakan');
    console.log('📝 Pastikan Anda sudah mengonfigurasi SCRIPT_URL di script.js');
    
    // Load daftar nama
    loadNamaList();
});
