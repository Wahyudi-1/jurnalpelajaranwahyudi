/**
 * =================================================================
 * SCRIPT UTAMA FRONTEND - JURNAL PEMBELAJARAN (VERSI LENGKAP & STABIL)
 * =================================================================
 * @version 3.9 - Implementasi Filter Bertingkat di Riwayat
 * @author Gemini AI Expert for User
 *
 * PERUBAHAN UTAMA:
 * - [FITUR] Mengimplementasikan filter bertingkat pada halaman Riwayat Jurnal.
 * - [UX] Pengalaman filter menjadi konsisten antara halaman Input dan Riwayat.
 */

// ====================================================================
// TAHAP 1: KONFIGURASI GLOBAL DAN STATE APLIKASI
// ====================================================================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwhX6G2IjsmEBejBfIH4TMxOLaE_TvZMe1t-MvIIqWNVxs8r6aDk2VyTjmmyeit75r99w/exec";

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
function showStatusMessage(message, type, duration) { /* ... */ }
function populateDropdown(elementId, options, defaultOptionText) { /* ... */ }
function showSection(sectionId) { /* ... */ }
function setupPasswordToggle() { /* ... */ }

// ====================================================================
// TAHAP 3: FUNGSI-FUNGSI UTAMA
// ====================================================================

// --- 3.1. OTENTIKASI & SESI ---
// (Tidak ada perubahan)
function checkAuthentication() { /* ... */ }
async function handleLogin() { /* ... */ }
function handleLogout() { /* ... */ }

// --- 3.2. DASHBOARD & DATA GLOBAL ---

/**
 * [DIPERBAIKI] Fungsi ini sekarang juga mereset dropdown di halaman riwayat
 * saat inisialisasi.
 */
async function initCascadingFilters() {
  if (!document.getElementById('filterTahunAjaran')) return;
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getRelationalFilterData`);
    const result = await response.json();
    if (result.status === 'success') {
      relationalFilterData = result.data;
      const allTahunAjaran = [...new Set(relationalFilterData.map(item => item.tahunAjaran).filter(Boolean))].sort();
      
      populateDropdown('filterTahunAjaran', allTahunAjaran, '-- Pilih Tahun Ajaran --');
      populateDropdown('riwayatFilterTahunAjaran', allTahunAjaran, '-- Semua Tahun --');
      
      resetAndDisableDropdown(document.getElementById('filterSemester'), '-- Pilih Semester --');
      resetAndDisableDropdown(document.getElementById('filterKelas'), '-- Pilih Kelas --');
      resetAndDisableDropdown(document.getElementById('filterMataPelajaran'), '-- Pilih Mapel --');
      
      // Reset juga filter di halaman riwayat
      resetAndDisableDropdown(document.getElementById('riwayatFilterSemester'), '-- Semua Semester --');
      resetAndDisableDropdown(document.getElementById('riwayatFilterKelas'), '-- Semua Kelas --');
      resetAndDisableDropdown(document.getElementById('riwayatFilterMapel'), '-- Semua Mapel --');
    } else { showStatusMessage('Gagal memuat data filter.', 'error'); }
  } catch (error) { console.error("Gagal memuat data filter relasional:", error); }
}

// (Tidak ada perubahan)
function onTahunAjaranChange() { /* ... */ }
function onSemesterChange() { /* ... */ }
function onKelasChange() { /* ... */ }

/**
 * [BARU] Logika filter bertingkat khusus untuk halaman Riwayat Jurnal.
 */
function onRiwayatTahunChange() {
  const selectedTahun = document.getElementById('riwayatFilterTahunAjaran').value;
  resetAndDisableDropdown(document.getElementById('riwayatFilterSemester'), '-- Semua Semester --');
  resetAndDisableDropdown(document.getElementById('riwayatFilterKelas'), '-- Semua Kelas --');
  resetAndDisableDropdown(document.getElementById('riwayatFilterMapel'), '-- Semua Mapel --');
  if (!selectedTahun) return;
  const availableSemesters = [...new Set(relationalFilterData.filter(item => item.tahunAjaran == selectedTahun).map(item => item.semester).filter(Boolean))].sort();
  populateDropdown('riwayatFilterSemester', availableSemesters, '-- Semua Semester --');
  document.getElementById('riwayatFilterSemester').disabled = false;
}
function onRiwayatSemesterChange() {
  const selectedTahun = document.getElementById('riwayatFilterTahunAjaran').value;
  const selectedSemester = document.getElementById('riwayatFilterSemester').value;
  resetAndDisableDropdown(document.getElementById('riwayatFilterKelas'), '-- Semua Kelas --');
  resetAndDisableDropdown(document.getElementById('riwayatFilterMapel'), '-- Semua Mapel --');
  if (!selectedSemester) return;
  const availableKelas = [...new Set(relationalFilterData.filter(item => item.tahunAjaran == selectedTahun && item.semester == selectedSemester).map(item => item.kelas).filter(Boolean))].sort();
  populateDropdown('riwayatFilterKelas', availableKelas, '-- Semua Kelas --');
  document.getElementById('riwayatFilterKelas').disabled = false;
}
function onRiwayatKelasChange() {
  const selectedTahun = document.getElementById('riwayatFilterTahunAjaran').value;
  const selectedSemester = document.getElementById('riwayatFilterSemester').value;
  const selectedKelas = document.getElementById('riwayatFilterKelas').value;
  resetAndDisableDropdown(document.getElementById('riwayatFilterMapel'), '-- Semua Mapel --');
  if (!selectedKelas) return;
  const availableMapel = [...new Set(relationalFilterData.filter(item => item.tahunAjaran == selectedTahun && item.semester == selectedSemester && item.kelas == selectedKelas).flatMap(item => item.mapel).filter(Boolean))].sort();
  populateDropdown('riwayatFilterMapel', availableMapel, '-- Semua Mapel --');
  document.getElementById('riwayatFilterMapel').disabled = false;
}

function resetAndDisableDropdown(selectElement, defaultText) { /* ... */ }
async function loadDashboardStats() { /* ... */ }

// --- Blok lainnya (Manajemen Siswa, Jurnal, Riwayat, Manajemen Pengguna) TIDAK BERUBAH ---
// ... (Kode untuk searchSiswa, saveSiswa, submitJurnal, loadRiwayatJurnal, loadUsers, dll tetap sama) ...
// (Untuk kebersihan, saya akan meringkasnya, tetapi di file Anda, kode ini harus tetap ada)
function checkAuthentication() { const user = sessionStorage.getItem('loggedInUser'); if (!user) { if (window.location.pathname.includes('dashboard.html')) window.location.href = 'index.html'; } else { const userData = JSON.parse(user); const welcomeEl = document.getElementById('welcomeMessage'); if (welcomeEl) welcomeEl.textContent = `Selamat Datang, ${userData.nama}!`; if (userData.peran && userData.peran.toLowerCase() !== 'admin') { const btn = document.querySelector('button[data-section="penggunaSection"]'); if (btn) btn.style.display = 'none'; } } }
async function handleLogin() { const u = document.getElementById('username'), p = document.getElementById('password'); if (!u.value || !p.value) return showStatusMessage("Username dan password harus diisi.", 'error'); showLoading(true); const fd = new FormData(); fd.append('action', 'login'); fd.append('username', u.value); fd.append('password', p.value); try { const r = await fetch(SCRIPT_URL, { method: 'POST', body: fd }); const d = await r.json(); if (d.status === "success") { sessionStorage.setItem('loggedInUser', JSON.stringify(d.data)); window.location.href = 'dashboard.html'; } else { showStatusMessage(d.message, 'error'); } } catch (e) { showStatusMessage(`Terjadi kesalahan jaringan: ${e.message}`, 'error'); } finally { showLoading(false); } }
function handleLogout() { if (confirm('Apakah Anda yakin ingin logout?')) { sessionStorage.removeItem('loggedInUser'); window.location.href = 'index.html'; } }
async function searchSiswa(forceRefresh = false) { const st = document.getElementById('nisnSearchInput').value.toLowerCase(), tb = document.getElementById('siswaResultsTableBody'); if (!tb) return; if (!forceRefresh && !st && cachedSiswaData.length > 0) { renderSiswaTable(cachedSiswaData); return; } showLoading(true); tb.innerHTML = '<tr><td colspan="5">Mencari...</td></tr>'; try { const r = await fetch(`${SCRIPT_URL}?action=searchSiswa&searchTerm=${encodeURIComponent(st)}`); const d = await r.json(); if (d.status === 'success') { if (!st) cachedSiswaData = d.data; renderSiswaTable(d.data); } else { tb.innerHTML = `<tr><td colspan="5">Gagal: ${d.message}</td></tr>`; } } catch (e) { showStatusMessage('Error jaringan.', 'error'); tb.innerHTML = '<tr><td colspan="5">Gagal terhubung.</td></tr>'; } finally { showLoading(false); } }
function renderSiswaTable(arr) { const tb = document.getElementById('siswaResultsTableBody'); tb.innerHTML = ''; if (arr.length === 0) { tb.innerHTML = '<tr><td colspan="5">Data tidak ditemukan.</td></tr>'; return; } arr.forEach(s => { const tr = document.createElement('tr'); tr.innerHTML = `<td data-label="NISN">${s.NISN}</td><td data-label="Nama">${s.Nama}</td><td data-label="Kelas">${s.Kelas}</td><td data-label="Tahun Ajaran">${s.TahunAjaran||''}</td><td data-label="Aksi"><button class="btn btn-sm btn-secondary" onclick="editSiswaHandler('${s.NISN}')">Ubah</button><button class="btn btn-sm btn-danger" onclick="deleteSiswaHandler('${s.NISN}')">Hapus</button></td>`; tb.appendChild(tr); }); }
async function saveSiswa() { const f = document.getElementById('formSiswa'), fd = new FormData(f), on = document.getElementById('formNisnOld').value, a = on ? 'updateSiswa' : 'addSiswa'; fd.append('action', a); if (on) fd.append('oldNisn', on); showLoading(true); try { const r = await fetch(SCRIPT_URL, { method: 'POST', body: fd }); const d = await r.json(); if (d.status === 'success') { showStatusMessage(d.message, 'success'); resetFormSiswa(); searchSiswa(true); } else { showStatusMessage(`Gagal: ${d.message}`, 'error'); } } catch (e) { showStatusMessage(`Error: ${e.message}`, 'error'); } finally { showLoading(false); } }
function editSiswaHandler(nisn) { const s = cachedSiswaData.find(s => s.NISN == nisn); if (!s) return; document.getElementById('formNisn').value = s.NISN; document.getElementById('formNama').value = s.Nama; document.getElementById('formKelas').value = s.Kelas; document.getElementById('formTahunAjaran').value = s.TahunAjaran; document.getElementById('formMapel').value = s.MataPelajaran || ''; document.getElementById('formNisnOld').value = s.NISN; const btn = document.getElementById('saveSiswaButton'); btn.textContent = 'Update Data'; btn.classList.add('btn-primary'); document.getElementById('formSiswa').scrollIntoView({ behavior: 'smooth' }); }
function resetFormSiswa() { document.getElementById('formSiswa').reset(); document.getElementById('formNisnOld').value = ''; const btn = document.getElementById('saveSiswaButton'); btn.textContent = 'Simpan Data'; btn.classList.remove('btn-primary'); }
async function deleteSiswaHandler(nisn) { if (confirm(`Yakin hapus siswa NISN: ${nisn}?`)) { showLoading(true); const fd = new FormData(); fd.append('action', 'deleteSiswa'); fd.append('nisn', nisn); try { const r = await fetch(SCRIPT_URL, { method: 'POST', body: fd }); const d = await r.json(); if (d.status === 'success') { showStatusMessage(d.message, 'success'); searchSiswa(true); } else { showStatusMessage(`Gagal: ${d.message}`, 'error'); } } catch (e) { showStatusMessage(`Error: ${e.message}`, 'error'); } finally { showLoading(false); } } }
function exportSiswaToExcel() { const t = document.querySelector("#siswaSection table"); if (!t || t.rows.length <= 1) return showStatusMessage('Tidak ada data.', 'error'); try { const wb = XLSX.utils.table_to_book(t, { sheet: "Daftar Siswa" }); XLSX.writeFile(wb, "Daftar_Siswa.xlsx"); showStatusMessage('Ekspor berhasil!', 'success'); } catch (e) { showStatusMessage('Gagal ekspor.', 'error'); } }
async function loadSiswaForPresensi() { const ta=document.getElementById('filterTahunAjaran').value, s=document.getElementById('filterSemester').value, k=document.getElementById('filterKelas').value, m=document.getElementById('filterMataPelajaran').value, tb=document.getElementById('presensiTableBody'); if(!ta||!s||!k||!m)return showStatusMessage('Pilih semua filter terlebih dahulu.', 'info'); showLoading(true); tb.innerHTML = '<tr><td colspan="3">Memuat...</td></tr>'; const p = new URLSearchParams({ action: 'getSiswaForPresensi', tahunAjaran: ta, semester: s, kelas: k, mapel: m }).toString(); try { const r = await fetch(`${SCRIPT_URL}?${p}`); const d = await r.json(); tb.innerHTML = ''; if (d.status === 'success' && d.data.length > 0) { d.data.forEach(s => { const tr = document.createElement('tr'); tr.dataset.nisn = s.NISN; tr.dataset.nama = s.Nama; tr.innerHTML = `<td data-label="NISN">${s.NISN}</td><td data-label="Nama">${s.Nama}</td><td data-label="Kehadiran"><select class="kehadiran-status" style="width:100%; padding: 0.5rem;"><option value="Hadir" selected>Hadir</option><option value="Sakit">Sakit</option><option value="Izin">Izin</option><option value="Alfa">Alfa</option></select></td>`; tb.appendChild(tr); }); } else { tb.innerHTML = '<tr><td colspan="3" style="text-align:center;">Tidak ada siswa.</td></tr>'; } } catch (e) { showStatusMessage('Error: ' + e.message, 'error'); } finally { showLoading(false); } }
async function submitJurnal() { const dj = { tahunAjaran: document.getElementById('filterTahunAjaran').value, semester: document.getElementById('filterSemester').value, kelas: document.getElementById('filterKelas').value, mataPelajaran: document.getElementById('filterMataPelajaran').value, tanggal: document.getElementById('tanggalPembelajaran').value, periode: document.getElementById('periodePembelajaran').value, materi: document.getElementById('materiPembelajaran').value, catatan: document.getElementById('catatanPembelajaran').value, }; for (const k in dj) { if (!dj[k] && k !== 'catatan' && k !== 'periode') return showStatusMessage(`Isi kolom "${k}"`, 'error'); } const pr = document.querySelectorAll('#presensiTableBody tr'); if (pr.length === 0 || pr[0].cells.length < 3) return showStatusMessage('Muat data siswa dahulu.', 'error'); const dp = Array.from(pr).map(r => ({ nisn: r.dataset.nisn, nama: r.dataset.nama, status: r.querySelector('.kehadiran-status').value })); const jd = { detail: dj, presensi: dp }; showLoading(true); try { const r = await fetch(`${SCRIPT_URL}?action=submitJurnal`, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(jd) }); const d = await r.json(); if (d.status === 'success') { showStatusMessage(d.message, 'success'); document.getElementById('formJurnal').reset(); document.getElementById('presensiTableBody').innerHTML = ''; initCascadingFilters(); } else { showStatusMessage(`Gagal: ${d.message}`, 'error'); } } catch (e) { showStatusMessage(`Error: ${e.message}`, 'error'); } finally { showLoading(false); } }
async function loadRiwayatJurnal() { const tb = document.getElementById('riwayatTableBody'), eb = document.getElementById('exportRiwayatButton'); if (!tb) return; const p = new URLSearchParams({ action: 'getJurnalHistory', tahunAjaran: document.getElementById('riwayatFilterTahunAjaran').value, semester: document.getElementById('riwayatFilterSemester').value, kelas: document.getElementById('riwayatFilterKelas').value, mapel: document.getElementById('riwayatFilterMapel').value, tanggalMulai: document.getElementById('riwayatFilterTanggalMulai').value, tanggalSelesai: document.getElementById('riwayatFilterTanggalSelesai').value }).toString(); showLoading(true); tb.innerHTML = '<tr><td colspan="7">Memuat...</td></tr>'; eb.style.display = 'none'; try { const r = await fetch(`${SCRIPT_URL}?${p}`); const d = await r.json(); if (d.status === 'success') { cachedJurnalHistory = d.data; renderRiwayatTable(d.data); if (d.data.length > 0) eb.style.display = 'inline-block'; } else { showStatusMessage(`Gagal: ${d.message}`, 'error'); tb.innerHTML = '<tr><td colspan="7">Gagal memuat.</td></tr>'; } } catch(e) { showStatusMessage('Error jaringan.', 'error'); tb.innerHTML = '<tr><td colspan="7">Error jaringan.</td></tr>'; } finally { showLoading(false); } }
function renderRiwayatTable(arr) { const tb = document.getElementById('riwayatTableBody'); tb.innerHTML = ''; if (arr.length === 0) { tb.innerHTML = '<tr><td colspan="7" style="text-align: center;">Tidak ada riwayat.</td></tr>'; return; } arr.forEach(j => { const tr = document.createElement('tr'); tr.innerHTML = `<td data-label="Tanggal">${new Date(j.Tanggal).toLocaleDateString('id-ID')}</td><td data-label="Kelas">${j.Kelas}</td><td data-label="Semester">${j.Semester||'N/A'}</td><td data-label="Mapel">${j.MataPelajaran}</td><td data-label="Materi">${(j.Materi||'').substring(0,50)}...</td><td data-label="Kehadiran">${j.Kehadiran}</td><td data-label="Aksi"><button class="btn btn-sm btn-secondary" onclick="showJurnalDetail('${j.ID}')">Detail</button></td>`; tb.appendChild(tr); }); }
function showJurnalDetail(jId) { const j = cachedJurnalHistory.find(j => j.ID == jId); if (!j) return alert('Detail tidak ditemukan!'); alert(`DETAIL JURNAL\n---------------------------------\nTanggal: ${new Date(j.Tanggal).toLocaleDateString('id-ID')}\nKelas: ${j.Kelas}\nSemester: ${j.Semester||'N/A'}\nMata Pelajaran: ${j.MataPelajaran}\nPeriode: ${j.Periode||'N/A'}\nKehadiran: ${j.Kehadiran}\n---------------------------------\nMateri:\n${j.Materi}\n\nCatatan:\n${j.Catatan||'Tidak ada.'}`); }
function exportRiwayatToExcel() { if (cachedJurnalHistory.length === 0) return showStatusMessage('Tidak ada data.', 'info'); const data = cachedJurnalHistory.map(j => ({ Tanggal: new Date(j.Tanggal).toLocaleDateString('id-ID'), "Tahun Ajaran": j.TahunAjaran, Semester: j.Semester, Kelas: j.Kelas, "Mata Pelajaran": j.MataPelajaran, Materi: j.Materi, Catatan: j.Catatan, Periode: j.Periode, Kehadiran: j.Kehadiran })); const ws = XLSX.utils.json_to_sheet(data); const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Riwayat Jurnal"); XLSX.writeFile(wb, `Riwayat_Jurnal_${new Date().toISOString().slice(0,10)}.xlsx`); }
async function loadUsers(forceRefresh = false) { const tb = document.getElementById('penggunaResultsTableBody'); if (!tb) return; if (!forceRefresh && cachedUsers.length > 0) { renderUsersTable(cachedUsers); return; } showLoading(true); tb.innerHTML = '<tr><td colspan="4">Memuat...</td></tr>'; try { const r = await fetch(`${SCRIPT_URL}?action=getUsers`); const d = await r.json(); if (d.status === 'success') { cachedUsers = d.data; renderUsersTable(d.data); } else { tb.innerHTML = `<tr><td colspan="4">Gagal: ${d.message}</td></tr>`; } } catch (e) { showStatusMessage('Error jaringan.', 'error'); tb.innerHTML = '<tr><td colspan="4">Gagal terhubung.</td></tr>'; } finally { showLoading(false); } }
function renderUsersTable(arr) { const tb = document.getElementById('penggunaResultsTableBody'); tb.innerHTML = ''; if (arr.length === 0) { tb.innerHTML = '<tr><td colspan="4">Belum ada pengguna.</td></tr>'; return; } arr.forEach(u => { const tr = document.createElement('tr'); tr.innerHTML = `<td data-label="Nama Lengkap">${u.nama}</td><td data-label="Username">${u.username}</td><td data-label="Peran">${u.peran}</td><td data-label="Aksi"><button class="btn btn-sm btn-secondary" onclick="editUserHandler('${u.username}')">Ubah</button><button class="btn btn-sm btn-danger" onclick="deleteUserHandler('${u.username}')">Hapus</button></td>`; tb.appendChild(tr); }); }
async function saveUser() { const ou = document.getElementById('formUsernameOld').value, a = ou ? 'updateUser' : 'addUser'; const fd = new FormData(); fd.append('action', a); fd.append('nama', document.getElementById('formNamaPengguna').value); fd.append('username', document.getElementById('formUsername').value); fd.append('password', document.getElementById('formPassword').value); fd.append('peran', document.getElementById('formPeran').value); if (ou) fd.append('oldUsername', ou); if (a === 'addUser' && !fd.get('password')) return showStatusMessage('Password wajib diisi.', 'error'); showLoading(true); try { const r = await fetch(SCRIPT_URL, { method: 'POST', body: fd }); const d = await r.json(); if (d.status === 'success') { showStatusMessage(d.message, 'success'); resetFormPengguna(); loadUsers(true); } else { showStatusMessage(`Gagal: ${d.message}`, 'error'); } } catch (e) { showStatusMessage(`Error: ${e.message}`, 'error'); } finally { showLoading(false); } }
function editUserHandler(u) { const user = cachedUsers.find(i => i.username === u); if (!user) return; document.getElementById('formUsernameOld').value = user.username; document.getElementById('formNamaPengguna').value = user.nama; document.getElementById('formUsername').value = user.username; document.getElementById('formPeran').value = user.peran; document.getElementById('formPassword').value = ''; document.getElementById('formPassword').placeholder = 'Kosongkan jika tidak diubah'; const btn = document.getElementById('savePenggunaButton'); btn.textContent = 'Update Pengguna'; document.getElementById('formPengguna').scrollIntoView({ behavior: 'smooth' }); }
async function deleteUserHandler(u) { const lu = JSON.parse(sessionStorage.getItem('loggedInUser')); if (lu && lu.username === u) return showStatusMessage('Tidak bisa hapus diri sendiri.', 'error'); if (confirm(`Yakin hapus pengguna '${u}'?`)) { showLoading(true); const fd = new FormData(); fd.append('action', 'deleteUser'); fd.append('username', u); try { const r = await fetch(SCRIPT_URL, { method: 'POST', body: fd }); const d = await r.json(); if (d.status === 'success') { showStatusMessage(d.message, 'success'); loadUsers(true); } else { showStatusMessage(`Gagal: ${d.message}`, 'error'); } } catch (e) { showStatusMessage(`Error: ${e.message}`, 'error'); } finally { showLoading(false); } } }
function resetFormPengguna() { document.getElementById('formPengguna').reset(); document.getElementById('formUsernameOld').value = ''; document.getElementById('savePenggunaButton').textContent = 'Simpan Pengguna'; document.getElementById('formPassword').placeholder = 'Isi password baru'; }

// ====================================================================
// TAHAP 4: INISIALISASI DAN EVENT LISTENERS
// ====================================================================

function setupDashboardListeners() {
    document.getElementById('logoutButton')?.addEventListener('click', handleLogout);
    const navButtons = document.querySelectorAll('.section-nav button');
    navButtons.forEach(b => {
        b.addEventListener('click', () => {
            navButtons.forEach(btn => btn.classList.remove('active'));
            b.classList.add('active');
            const sId = b.dataset.section;
            showSection(sId);
            if (sId === 'riwayatSection') loadRiwayatJurnal();
            else if (sId === 'penggunaSection') loadUsers(true);
            else if (sId === 'jurnalSection') loadDashboardStats();
        });
    });
    
    initCascadingFilters().then(() => {
        document.getElementById('filterTahunAjaran')?.addEventListener('change', onTahunAjaranChange);
        document.getElementById('filterSemester')?.addEventListener('change', onSemesterChange);
        document.getElementById('filterKelas')?.addEventListener('change', onKelasChange);
        // Listener untuk riwayat
        document.getElementById('riwayatFilterTahunAjaran')?.addEventListener('change', onRiwayatTahunChange);
        document.getElementById('riwayatFilterSemester')?.addEventListener('change', onRiwayatSemesterChange);
        document.getElementById('riwayatFilterKelas')?.addEventListener('change', onRiwayatKelasChange);
    });

    document.getElementById('loadSiswaButton')?.addEventListener('click', loadSiswaForPresensi);
    document.getElementById('submitJurnalButton')?.addEventListener('click', submitJurnal);
    document.getElementById('filterRiwayatButton')?.addEventListener('click', loadRiwayatJurnal);
    document.getElementById('exportRiwayatButton')?.addEventListener('click', exportRiwayatToExcel);
    document.getElementById('formSiswa')?.addEventListener('submit', (e) => { e.preventDefault(); saveSiswa(); });
    document.getElementById('resetSiswaButton')?.addEventListener('click', resetFormSiswa);
    document.getElementById('searchButton')?.addEventListener('click', () => searchSiswa(true));
    document.getElementById('exportSiswaExcel')?.addEventListener('click', exportSiswaToExcel);
    document.getElementById('nisnSearchInput')?.addEventListener('keyup', (e) => {
        clearTimeout(searchTimeout);
        if (e.key === 'Enter') searchSiswa(true);
        else searchTimeout = setTimeout(() => searchSiswa(true), 400);
    });
    document.getElementById('formPengguna')?.addEventListener('submit', (e) => { e.preventDefault(); saveUser(); });
    document.getElementById('resetPenggunaButton')?.addEventListener('click', resetFormPengguna);
}
function initDashboardPage() {
    checkAuthentication();
    setupDashboardListeners();
    showSection('jurnalSection');
    const db = document.querySelector('.section-nav button[data-section="jurnalSection"]');
    if (db) {
        db.classList.add('active');
        loadDashboardStats();
    }
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
    if (pageName === 'dashboard.html' || pageName === '') {
        if (sessionStorage.getItem('loggedInUser')) {
            initDashboardPage();
        } else if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'index.html';
        } else {
            initLoginPage();
        }
    } else if (pageName === 'index.html') {
        initLoginPage();
    }
});
