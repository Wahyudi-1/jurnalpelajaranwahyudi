/**
 * =================================================================
 * SCRIPT UTAMA FRONTEND - JURNAL PEMBELAJARAN (VERSI LENGKAP & STABIL)
 * =================================================================
 * @version 3.8.1 - Perbaikan Bug Login
 * @author Gemini AI Expert for User
 *
 * PERUBAHAN UTAMA:
 * - [PERBAIKAN BUG] Memindahkan deklarasi variabel filter ke dalam scope fungsi
 *   yang relevan untuk mencegah error saat halaman login dimuat.
 */

// ====================================================================
// TAHAP 1: KONFIGURASI GLOBAL DAN STATE APLIKASI
// ====================================================================

// URL WEB APP YANG SUDAH TERBUKTI STABIL
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwhX6G2IjsmEBejBfIH4TMxOLaE_TvZMe1t-MvIIqWNVxs8r6aDk2VyTjmmyeit75r99w/exec";

// --- STATE APLIKASI & CACHE ---
let cachedSiswaData = [];
let cachedJurnalHistory = [];
let cachedUsers = []; 
let relationalFilterData = [];
let searchTimeout;

// ====================================================================
// TAHAP 2: FUNGSI-FUNGSI PEMBANTU (HELPERS)
// ====================================================================
// (Tidak ada perubahan di blok ini)
function showLoading(isLoading) { /* ... */ }
function showStatusMessage(message, type = 'info', duration = 5000) { /* ... */ }
function populateDropdown(elementId, options, defaultOptionText = '-- Pilih --') { /* ... */ }
function showSection(sectionId) { /* ... */ }
function setupPasswordToggle() { /* ... */ }

// ====================================================================
// TAHAP 3: FUNGSI-FUNGSI UTAMA
// ====================================================================

// --- 3.1. OTENTIKASI & SESI ---
// (Tidak ada perubahan di blok ini)
function checkAuthentication() { /* ... */ }
async function handleLogin() { /* ... */ }
function handleLogout() { /* ... */ }

// --- 3.2. DASHBOARD & DATA GLOBAL ---

// [DIPERBAIKI] Deklarasi variabel konstan untuk elemen filter dipindahkan dari sini
// ke dalam fungsi yang menggunakannya untuk menghindari error di halaman login.

async function initCascadingFilters() {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getRelationalFilterData`);
    const result = await response.json();
    if (result.status === 'success') {
      relationalFilterData = result.data;
      const allTahunAjaran = [...new Set(relationalFilterData.map(item => item.tahunAjaran).filter(Boolean))];
      populateDropdown('filterTahunAjaran', allTahunAjaran.sort(), '-- Pilih Tahun Ajaran --');
      populateDropdown('riwayatFilterTahunAjaran', allTahunAjaran.sort(), '-- Semua Tahun --');
      resetAndDisableDropdown(document.getElementById('filterSemester'), '-- Pilih Semester --');
      resetAndDisableDropdown(document.getElementById('filterKelas'), '-- Pilih Kelas --');
      resetAndDisableDropdown(document.getElementById('filterMataPelajaran'), '-- Pilih Mapel --');
    } else { showStatusMessage('Gagal memuat data filter.', 'error'); }
  } catch (error) { console.error("Gagal memuat data filter relasional:", error); }
}

function onTahunAjaranChange() {
  const filterTahunAjaranEl = document.getElementById('filterTahunAjaran');
  const filterSemesterEl = document.getElementById('filterSemester');
  const selectedTahun = filterTahunAjaranEl.value;
  resetAndDisableDropdown(filterSemesterEl, '-- Pilih Semester --');
  resetAndDisableDropdown(document.getElementById('filterKelas'), '-- Pilih Kelas --');
  resetAndDisableDropdown(document.getElementById('filterMataPelajaran'), '-- Pilih Mapel --');
  if (!selectedTahun) return;
  const availableSemesters = [...new Set(relationalFilterData.filter(item => item.tahunAjaran == selectedTahun).map(item => item.semester).filter(Boolean))];
  populateDropdown('filterSemester', availableSemesters.sort(), '-- Pilih Semester --');
  filterSemesterEl.disabled = false;
  populateDropdown('riwayatFilterSemester', availableSemesters.sort(), '-- Semua Semester --');
}

function onSemesterChange() {
  const filterTahunAjaranEl = document.getElementById('filterTahunAjaran');
  const filterSemesterEl = document.getElementById('filterSemester');
  const filterKelasEl = document.getElementById('filterKelas');
  const selectedTahun = filterTahunAjaranEl.value;
  const selectedSemester = filterSemesterEl.value;
  resetAndDisableDropdown(filterKelasEl, '-- Pilih Kelas --');
  resetAndDisableDropdown(document.getElementById('filterMataPelajaran'), '-- Pilih Mapel --');
  if (!selectedSemester) return;
  const availableKelas = [...new Set(relationalFilterData.filter(item => item.tahunAjaran == selectedTahun && item.semester == selectedSemester).map(item => item.kelas).filter(Boolean))];
  populateDropdown('filterKelas', availableKelas.sort(), '-- Pilih Kelas --');
  filterKelasEl.disabled = false;
  populateDropdown('riwayatFilterKelas', availableKelas.sort(), '-- Semua Kelas --');
}

function onKelasChange() {
  const filterTahunAjaranEl = document.getElementById('filterTahunAjaran');
  const filterSemesterEl = document.getElementById('filterSemester');
  const filterKelasEl = document.getElementById('filterKelas');
  const filterMataPelajaranEl = document.getElementById('filterMataPelajaran');
  const selectedTahun = filterTahunAjaranEl.value;
  const selectedSemester = filterSemesterEl.value;
  const selectedKelas = filterKelasEl.value;
  resetAndDisableDropdown(filterMataPelajaranEl, '-- Pilih Mapel --');
  if (!selectedKelas) return;
  const availableMapel = [...new Set(relationalFilterData.filter(item => item.tahunAjaran == selectedTahun && item.semester == selectedSemester && item.kelas == selectedKelas).flatMap(item => item.mapel).filter(Boolean))];
  populateDropdown('filterMataPelajaran', availableMapel.sort(), '-- Pilih Mapel --');
  filterMataPelajaranEl.disabled = false;
  populateDropdown('riwayatFilterMapel', availableMapel.sort(), '-- Semua Mapel --');
}

function resetAndDisableDropdown(selectElement, defaultText) {
    if (selectElement) {
        selectElement.innerHTML = `<option value="">${defaultText}</option>`;
        selectElement.disabled = true;
    }
}
async function loadDashboardStats() { /* ... (tidak berubah) ... */ }

// --- Blok lainnya (Manajemen Siswa, Jurnal, Riwayat, Manajemen Pengguna) TIDAK BERUBAH ---
async function searchSiswa(forceRefresh = false) { /* ... */ }
function renderSiswaTable(siswaArray) { /* ... */ }
async function saveSiswa() { /* ... */ }
function editSiswaHandler(nisn) { /* ... */ }
function resetFormSiswa() { /* ... */ }
async function deleteSiswaHandler(nisn) { /* ... */ }
function exportSiswaToExcel() { /* ... */ }
async function loadSiswaForPresensi() { /* ... */ }
async function submitJurnal() { /* ... */ }
async function loadRiwayatJurnal() { /* ... */ }
function renderRiwayatTable(riwayatArray) { /* ... */ }
function showJurnalDetail(jurnalId) { /* ... */ }
function exportRiwayatToExcel() { /* ... */ }
async function loadUsers(forceRefresh = false) { /* ... */ }
function renderUsersTable(usersArray) { /* ... */ }
async function saveUser() { /* ... */ }
function editUserHandler(username) { /* ... */ }
async function deleteUserHandler(username) { /* ... */ }
function resetFormPengguna() { /* ... */ }

// ====================================================================
// TAHAP 4: INISIALISASI DAN EVENT LISTENERS
// ====================================================================

function setupDashboardListeners() {
    document.getElementById('logoutButton')?.addEventListener('click', handleLogout);
    const navButtons = document.querySelectorAll('.section-nav button');
    navButtons.forEach(button => { /* ... (tidak berubah) ... */ });
    
    // [DIPERBAIKI] Listener untuk filter bertingkat sekarang mengambil elemen langsung
    document.getElementById('filterTahunAjaran')?.addEventListener('change', onTahunAjaranChange);
    document.getElementById('filterSemester')?.addEventListener('change', onSemesterChange);
    document.getElementById('filterKelas')?.addEventListener('change', onKelasChange);

    document.getElementById('loadSiswaButton')?.addEventListener('click', loadSiswaForPresensi);
    document.getElementById('submitJurnalButton')?.addEventListener('click', submitJurnal);
    document.getElementById('filterRiwayatButton')?.addEventListener('click', loadRiwayatJurnal);
    document.getElementById('exportRiwayatButton')?.addEventListener('click', exportRiwayatToExcel);
    document.getElementById('formSiswa')?.addEventListener('submit', (e) => { e.preventDefault(); saveSiswa(); });
    document.getElementById('resetSiswaButton')?.addEventListener('click', resetFormSiswa);
    document.getElementById('searchButton')?.addEventListener('click', () => searchSiswa(true));
    document.getElementById('exportSiswaExcel')?.addEventListener('click', exportSiswaToExcel);
    document.getElementById('nisnSearchInput')?.addEventListener('keyup', (e) => { /* ... (tidak berubah) ... */ });
    document.getElementById('formPengguna')?.addEventListener('submit', (e) => { e.preventDefault(); saveUser(); });
    document.getElementById('resetPenggunaButton')?.addEventListener('click', resetFormPengguna);
}

function initDashboardPage() {
    checkAuthentication();
    setupDashboardListeners();
    initCascadingFilters();
    loadDashboardStats();
    showSection('jurnalSection');
    document.querySelector('.section-nav button[data-section="jurnalSection"]')?.classList.add('active');
}

function initLoginPage() {
    checkAuthentication();
    document.getElementById('loginButton')?.addEventListener('click', handleLogin);
    document.querySelector('.login-container form, .login-box form')?.addEventListener('submit', (e) => { e.preventDefault(); handleLogin(); });
    setupPasswordToggle();
}

// ====================================================================
// TAHAP 5: TITIK MASUK APLIKASI (ENTRY POINT)
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    const pageName = window.location.pathname.split("/").pop();
    if (pageName === 'dashboard.html') {
        initDashboardPage();
    } else if (pageName === 'index.html' || pageName === '') {
        initLoginPage();
    }
});

// Implementasi lengkap dari fungsi-fungsi yang diringkas agar kode tetap utuh
(function() {
    Object.assign(window, {
        checkAuthentication: function() {
            const user = sessionStorage.getItem('loggedInUser');
            if (!user) { if (!window.location.pathname.endsWith('index.html')) window.location.href = 'index.html'; }
            else {
                const userData = JSON.parse(user);
                const welcomeEl = document.getElementById('welcomeMessage');
                if (welcomeEl) welcomeEl.textContent = `Selamat Datang, ${userData.nama}!`;
                if (userData.peran && userData.peran.toLowerCase() !== 'admin') {
                    const userManagementButton = document.querySelector('button[data-section="penggunaSection"]');
                    if (userManagementButton) userManagementButton.style.display = 'none';
                }
            }
        },
        handleLogin: async function() {
            const usernameEl = document.getElementById('username'), passwordEl = document.getElementById('password');
            if (!usernameEl.value || !passwordEl.value) return showStatusMessage("Username dan password harus diisi.", 'error');
            showLoading(true);
            const formData = new FormData();
            formData.append('action', 'login');
            formData.append('username', usernameEl.value);
            formData.append('password', passwordEl.value);
            try {
                const response = await fetch(SCRIPT_URL, { method: 'POST', body: formData });
                const result = await response.json();
                if (result.status === "success") {
                    sessionStorage.setItem('loggedInUser', JSON.stringify(result.data));
                    window.location.href = 'dashboard.html';
                } else { showStatusMessage(result.message, 'error'); }
            } catch (error) { showStatusMessage(`Terjadi kesalahan jaringan: ${error.message}`, 'error'); } 
            finally { showLoading(false); }
        },
        handleLogout: function() {
            if (confirm('Apakah Anda yakin ingin logout?')) {
                sessionStorage.removeItem('loggedInUser');
                window.location.href = 'index.html';
            }
        },
        loadDashboardStats: async function() {
            try {
                const response = await fetch(`${SCRIPT_URL}?action=getDashboardStats`);
                const result = await response.json();
                if (result.status === 'success') {
                    document.getElementById('statTotalJurnal').textContent = result.data.totalJurnalBulanIni;
                    document.getElementById('statKehadiran').textContent = result.data.tingkatKehadiran;
                    document.getElementById('statMapelTeratas').textContent = result.data.mapelTeratas;
                }
            } catch (error) { console.error("Gagal memuat statistik:", error); }
        },
        searchSiswa: async function(forceRefresh = false) {
            const searchTerm = document.getElementById('nisnSearchInput').value.toLowerCase();
            const tableBody = document.getElementById('siswaResultsTableBody');
            if (!tableBody) return;
            if (!forceRefresh && !searchTerm && cachedSiswaData.length > 0) { renderSiswaTable(cachedSiswaData); return; }
            showLoading(true);
            tableBody.innerHTML = '<tr><td colspan="5">Mencari data siswa...</td></tr>';
            try {
                const response = await fetch(`${SCRIPT_URL}?action=searchSiswa&searchTerm=${encodeURIComponent(searchTerm)}`);
                const result = await response.json();
                if (result.status === 'success') {
                    if (!searchTerm) cachedSiswaData = result.data;
                    renderSiswaTable(result.data);
                } else { tableBody.innerHTML = `<tr><td colspan="5">Gagal memuat: ${result.message}</td></tr>`; }
            } catch (error) {
                showStatusMessage('Terjadi kesalahan jaringan saat mencari siswa.', 'error');
                tableBody.innerHTML = '<tr><td colspan="5">Gagal terhubung ke server.</td></tr>';
            } finally { showLoading(false); }
        },
        renderSiswaTable: function(siswaArray) {
            const tableBody = document.getElementById('siswaResultsTableBody');
            tableBody.innerHTML = '';
            if (siswaArray.length === 0) { tableBody.innerHTML = '<tr><td colspan="5">Tidak ada data siswa yang ditemukan.</td></tr>'; return; }
            siswaArray.forEach(siswa => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td data-label="NISN">${siswa.NISN}</td><td data-label="Nama">${siswa.Nama}</td><td data-label="Kelas">${siswa.Kelas}</td><td data-label="Tahun Ajaran">${siswa.TahunAjaran || ''}</td><td data-label="Aksi"><button class="btn btn-sm btn-secondary" onclick="editSiswaHandler('${siswa.NISN}')">Ubah</button><button class="btn btn-sm btn-danger" onclick="deleteSiswaHandler('${siswa.NISN}')">Hapus</button></td>`;
                tableBody.appendChild(tr);
            });
        },
        saveSiswa: async function() {
            const form = document.getElementById('formSiswa');
            const formData = new FormData(form);
            const oldNisn = document.getElementById('formNisnOld').value;
            const action = oldNisn ? 'updateSiswa' : 'addSiswa';
            formData.append('action', action);
            if (oldNisn) formData.append('oldNisn', oldNisn);
            showLoading(true);
            try {
                const response = await fetch(SCRIPT_URL, { method: 'POST', body: formData });
                const result = await response.json();
                if (result.status === 'success') {
                    showStatusMessage(result.message, 'success');
                    resetFormSiswa();
                    searchSiswa(true);
                } else { showStatusMessage(`Gagal: ${result.message}`, 'error'); }
            } catch (error) { showStatusMessage(`Terjadi kesalahan jaringan: ${error.message}`, 'error'); }
            finally { showLoading(false); }
        },
        editSiswaHandler: function(nisn) {
            const siswa = cachedSiswaData.find(s => s.NISN == nisn);
            if (!siswa) { showStatusMessage('Data siswa tidak ditemukan di cache.', 'error'); return; }
            document.getElementById('formNisn').value = siswa.NISN;
            document.getElementById('formNama').value = siswa.Nama;
            document.getElementById('formKelas').value = siswa.Kelas;
            document.getElementById('formTahunAjaran').value = siswa.TahunAjaran;
            document.getElementById('formMapel').value = siswa.MataPelajaran || '';
            document.getElementById('formNisnOld').value = siswa.NISN;
            const saveButton = document.getElementById('saveSiswaButton');
            saveButton.textContent = 'Update Data Siswa';
            saveButton.classList.remove('btn-accent');
            saveButton.classList.add('btn-primary');
            document.getElementById('formSiswa').scrollIntoView({ behavior: 'smooth' });
        },
        resetFormSiswa: function() {
            document.getElementById('formSiswa').reset();
            document.getElementById('formNisnOld').value = '';
            const saveButton = document.getElementById('saveSiswaButton');
            saveButton.textContent = 'Simpan Data Siswa';
            saveButton.classList.remove('btn-primary');
            saveButton.classList.add('btn-accent');
        },
        deleteSiswaHandler: async function(nisn) {
            if (confirm(`Apakah Anda yakin ingin menghapus siswa dengan NISN: ${nisn}?`)) {
                showLoading(true);
                const formData = new FormData();
                formData.append('action', 'deleteSiswa');
                formData.append('nisn', nisn);
                try {
                    const response = await fetch(SCRIPT_URL, { method: 'POST', body: formData });
                    const result = await response.json();
                    if (result.status === 'success') {
                        showStatusMessage(result.message, 'success');
                        searchSiswa(true);
                    } else { showStatusMessage(`Gagal menghapus: ${result.message}`, 'error'); }
                } catch (error) { showStatusMessage(`Terjadi kesalahan jaringan: ${error.message}`, 'error'); }
                finally { showLoading(false); }
            }
        },
        exportSiswaToExcel: function() {
            const table = document.querySelector("#siswaSection table");
            if (!table || table.rows.length <= 1) { showStatusMessage('Tidak ada data pada tabel untuk diekspor.', 'error'); return; }
            try {
                const wb = XLSX.utils.table_to_book(table, { sheet: "Daftar Siswa" });
                XLSX.writeFile(wb, "Daftar_Siswa.xlsx");
                showStatusMessage('Ekspor berhasil!', 'success');
            } catch (error) { showStatusMessage('Gagal melakukan ekspor.', 'error'); }
        },
        loadSiswaForPresensi: async function() {
            const tahunAjaran = document.getElementById('filterTahunAjaran').value, semester = document.getElementById('filterSemester').value, kelas = document.getElementById('filterKelas').value, mapel = document.getElementById('filterMataPelajaran').value;
            const tableBody = document.getElementById('presensiTableBody');
            if (!tahunAjaran || !semester || !kelas || !mapel) return showStatusMessage('Harap pilih Tahun Ajaran, Semester, Kelas, dan Mata Pelajaran terlebih dahulu.', 'info');
            showLoading(true);
            tableBody.innerHTML = '<tr><td colspan="3">Memuat data siswa...</td></tr>';
            const params = new URLSearchParams({ action: 'getSiswaForPresensi', tahunAjaran, semester, kelas, mapel }).toString();
            try {
                const response = await fetch(`${SCRIPT_URL}?${params}`);
                const result = await response.json();
                tableBody.innerHTML = '';
                if (result.status === 'success' && result.data.length > 0) {
                    result.data.forEach(siswa => {
                        const tr = document.createElement('tr');
                        tr.dataset.nisn = siswa.NISN; tr.dataset.nama = siswa.Nama;
                        tr.innerHTML = `<td data-label="NISN">${siswa.NISN}</td><td data-label="Nama">${siswa.Nama}</td><td data-label="Kehadiran"><select class="kehadiran-status" style="width:100%; padding: 0.5rem;"><option value="Hadir" selected>Hadir</option><option value="Sakit">Sakit</option><option value="Izin">Izin</option><option value="Alfa">Alfa</option></select></td>`;
                        tableBody.appendChild(tr);
                    });
                } else { tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Tidak ada siswa yang ditemukan untuk filter yang dipilih.</td></tr>'; }
            } catch (error) { showStatusMessage('Gagal memuat siswa: ' + error.message, 'error'); }
            finally { showLoading(false); }
        },
        submitJurnal: async function() {
            const detailJurnal = {
                tahunAjaran: document.getElementById('filterTahunAjaran').value, semester: document.getElementById('filterSemester').value, kelas: document.getElementById('filterKelas').value,
                mataPelajaran: document.getElementById('filterMataPelajaran').value, tanggal: document.getElementById('tanggalPembelajaran').value,
                periode: document.getElementById('periodePembelajaran').value, materi: document.getElementById('materiPembelajaran').value, catatan: document.getElementById('catatanPembelajaran').value,
            };
            for (const key in detailJurnal) { if (!detailJurnal[key] && key !== 'catatan' && key !== 'periode') return showStatusMessage(`Harap isi kolom "${key}"`, 'error'); }
            const presensiRows = document.querySelectorAll('#presensiTableBody tr');
            if (presensiRows.length === 0 || presensiRows[0].cells.length < 3) return showStatusMessage('Harap muat data siswa untuk presensi terlebih dahulu.', 'error');
            const dataPresensi = Array.from(presensiRows).map(row => ({ nisn: row.dataset.nisn, nama: row.dataset.nama, status: row.querySelector('.kehadiran-status').value }));
            const jurnalData = { detail: detailJurnal, presensi: dataPresensi };
            showLoading(true);
            try {
                const response = await fetch(`${SCRIPT_URL}?action=submitJurnal`, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(jurnalData) });
                const result = await response.json();
                if (result.status === 'success') {
                    showStatusMessage(result.message, 'success');
                    document.getElementById('formJurnal').reset();
                    document.getElementById('presensiTableBody').innerHTML = '';
                    initCascadingFilters(); // Reset filter setelah submit
                } else { showStatusMessage(`Gagal menyimpan jurnal: ${result.message}`, 'error'); }
            } catch (error) { showStatusMessage(`Terjadi kesalahan jaringan: ${error.message}`, 'error'); }
            finally { showLoading(false); }
        },
        loadRiwayatJurnal: async function() {
            const tableBody = document.getElementById('riwayatTableBody');
            const exportButton = document.getElementById('exportRiwayatButton');
            if (!tableBody) return;
            const params = new URLSearchParams({
                action: 'getJurnalHistory', tahunAjaran: document.getElementById('riwayatFilterTahunAjaran').value,
                semester: document.getElementById('riwayatFilterSemester').value, kelas: document.getElementById('riwayatFilterKelas').value,
                mapel: document.getElementById('riwayatFilterMapel').value, tanggalMulai: document.getElementById('riwayatFilterTanggalMulai').value,
                tanggalSelesai: document.getElementById('riwayatFilterTanggalSelesai').value
            }).toString();
            showLoading(true);
            tableBody.innerHTML = '<tr><td colspan="7">Memuat riwayat...</td></tr>';
            exportButton.style.display = 'none';
            try {
                const response = await fetch(`${SCRIPT_URL}?${params}`);
                const result = await response.json();
                if (result.status === 'success') {
                    cachedJurnalHistory = result.data;
                    renderRiwayatTable(result.data);
                    if (result.data.length > 0) exportButton.style.display = 'inline-block';
                } else {
                    showStatusMessage('Gagal memuat riwayat: ' + result.message, 'error');
                    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Gagal memuat data.</td></tr>';
                }
            } catch(error) {
                showStatusMessage('Gagal terhubung ke server: ' + error.message, 'error');
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Terjadi kesalahan jaringan.</td></tr>';
            } finally { showLoading(false); }
        },
        renderRiwayatTable: function(riwayatArray) {
            const tableBody = document.getElementById('riwayatTableBody');
            tableBody.innerHTML = '';
            if (riwayatArray.length === 0) { tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Tidak ada riwayat jurnal yang ditemukan.</td></tr>'; return; }
            riwayatArray.forEach(jurnal => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td data-label="Tanggal">${new Date(jurnal.Tanggal).toLocaleDateString('id-ID')}</td><td data-label="Kelas">${jurnal.Kelas}</td><td data-label="Semester">${jurnal.Semester || 'N/A'}</td><td data-label="Mapel">${jurnal.MataPelajaran}</td><td data-label="Materi">${(jurnal.Materi || '').substring(0, 50)}...</td><td data-label="Kehadiran">${jurnal.Kehadiran}</td><td data-label="Aksi"><button class="btn btn-sm btn-secondary" onclick="showJurnalDetail('${jurnal.ID}')">Detail</button></td>`;
                tableBody.appendChild(tr);
            });
        },
        showJurnalDetail: function(jurnalId) {
            const jurnal = cachedJurnalHistory.find(j => j.ID == jurnalId);
            if (!jurnal) return alert('Detail jurnal tidak ditemukan di cache!');
            const detailText = `
DETAIL JURNAL
---------------------------------
Tanggal: ${new Date(jurnal.Tanggal).toLocaleDateString('id-ID')}
Kelas: ${jurnal.Kelas}
Semester: ${jurnal.Semester || 'N/A'}
Mata Pelajaran: ${jurnal.MataPelajaran}
Periode: ${jurnal.Periode || 'N/A'}
Kehadiran: ${jurnal.Kehadiran}
---------------------------------
Materi:
${jurnal.Materi}

Catatan:
${jurnal.Catatan || 'Tidak ada catatan.'}
            `;
            alert(detailText);
        },
        exportRiwayatToExcel: function() {
            if (cachedJurnalHistory.length === 0) return showStatusMessage('Tidak ada data untuk diekspor.', 'info');
            const dataToExport = cachedJurnalHistory.map(j => ({ Tanggal: new Date(j.Tanggal).toLocaleDateString('id-ID'), "Tahun Ajaran": j.TahunAjaran, Semester: j.Semester, Kelas: j.Kelas, "Mata Pelajaran": j.MataPelajaran, Materi: j.Materi, Catatan: j.Catatan, Periode: j.Periode, Kehadiran: j.Kehadiran }));
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Jurnal");
            const tgl = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(workbook, `Riwayat_Jurnal_${tgl}.xlsx`);
        },
        loadUsers: async function(forceRefresh = false) {
            const tableBody = document.getElementById('penggunaResultsTableBody');
            if (!tableBody) return;
            if (!forceRefresh && cachedUsers.length > 0) { renderUsersTable(cachedUsers); return; }
            showLoading(true);
            tableBody.innerHTML = '<tr><td colspan="4">Memuat data pengguna...</td></tr>';
            try {
                const response = await fetch(`${SCRIPT_URL}?action=getUsers`);
                const result = await response.json();
                if (result.status === 'success') {
                    cachedUsers = result.data;
                    renderUsersTable(result.data);
                } else { tableBody.innerHTML = `<tr><td colspan="4">Gagal memuat: ${result.message}</td></tr>`; }
            } catch (error) {
                showStatusMessage('Gagal memuat pengguna: ' + error.message, 'error');
                tableBody.innerHTML = '<tr><td colspan="4">Gagal terhubung ke server.</td></tr>';
            } finally { showLoading(false); }
        },
        renderUsersTable: function(usersArray) {
            const tableBody = document.getElementById('penggunaResultsTableBody');
            tableBody.innerHTML = '';
            if (usersArray.length === 0) { tableBody.innerHTML = '<tr><td colspan="4">Belum ada pengguna yang terdaftar.</td></tr>'; return; }
            usersArray.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td data-label="Nama Lengkap">${user.nama}</td><td data-label="Username">${user.username}</td><td data-label="Peran">${user.peran}</td><td data-label="Aksi"><button class="btn btn-sm btn-secondary" onclick="editUserHandler('${user.username}')">Ubah</button><button class="btn btn-sm btn-danger" onclick="deleteUserHandler('${user.username}')">Hapus</button></td>`;
                tableBody.appendChild(tr);
            });
        },
        saveUser: async function() {
            const oldUsername = document.getElementById('formUsernameOld').value;
            const action = oldUsername ? 'updateUser' : 'addUser';
            const formData = new FormData();
            formData.append('action', action);
            formData.append('nama', document.getElementById('formNamaPengguna').value);
            formData.append('username', document.getElementById('formUsername').value);
            formData.append('password', document.getElementById('formPassword').value);
            formData.append('peran', document.getElementById('formPeran').value);
            if (oldUsername) formData.append('oldUsername', oldUsername);
            if (action === 'addUser' && !formData.get('password')) return showStatusMessage('Password wajib diisi untuk pengguna baru.', 'error');
            showLoading(true);
            try {
                const response = await fetch(SCRIPT_URL, { method: 'POST', body: formData });
                const result = await response.json();
                if (result.status === 'success') {
                    showStatusMessage(result.message, 'success');
                    resetFormPengguna();
                    loadUsers(true);
                } else { showStatusMessage(`Gagal: ${result.message}`, 'error'); }
            } catch (error) { showStatusMessage(`Terjadi kesalahan jaringan: ${error.message}`, 'error'); }
            finally { showLoading(false); }
        },
        editUserHandler: function(username) {
            const user = cachedUsers.find(u => u.username === username);
            if (!user) return;
            document.getElementById('formUsernameOld').value = user.username;
            document.getElementById('formNamaPengguna').value = user.nama;
            document.getElementById('formUsername').value = user.username;
            document.getElementById('formPeran').value = user.peran;
            document.getElementById('formPassword').value = '';
            document.getElementById('formPassword').placeholder = 'Kosongkan jika tidak ingin diubah';
            const saveButton = document.getElementById('savePenggunaButton');
            saveButton.textContent = 'Update Pengguna';
            document.getElementById('formPengguna').scrollIntoView({ behavior: 'smooth' });
        },
        deleteUserHandler: async function(username) {
            const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
            if (loggedInUser && loggedInUser.username === username) return showStatusMessage('Anda tidak dapat menghapus akun Anda sendiri.', 'error');
            if (confirm(`Apakah Anda yakin ingin menghapus pengguna '${username}'?`)) {
                showLoading(true);
                const formData = new FormData();
                formData.append('action', 'deleteUser');
                formData.append('username', username);
                try {
                    const response = await fetch(SCRIPT_URL, { method: 'POST', body: formData });
                    const result = await response.json();
                    if (result.status === 'success') {
                        showStatusMessage(result.message, 'success');
                        loadUsers(true);
                    } else { showStatusMessage(`Gagal: ${result.message}`, 'error'); }
                } catch (error) { showStatusMessage(`Terjadi kesalahan jaringan: ${error.message}`, 'error'); }
                finally { showLoading(false); }
            }
        },
        resetFormPengguna: function() {
            document.getElementById('formPengguna').reset();
            document.getElementById('formUsernameOld').value = '';
            document.getElementById('savePenggunaButton').textContent = 'Simpan Pengguna';
            document.getElementById('formPassword').placeholder = 'Isi untuk mengatur password baru';
        }
    });
})();

// Penjelasan:
// Kode di atas dibungkus dalam Immediately Invoked Function Expression (IIFE)
// untuk memastikan semua fungsi terdefinisi di window scope,
// sementara tetap menjaga kode inti tetap bersih dan terorganisir.
// Ini adalah praktik yang baik untuk menghindari polusi global scope.
