"""
================================================================================
MENARA HANOI: 100 BALOK PADA 10 TIANG
(1 Tiang Utama/Asal, 8 Tiang Transit, 1 Tiang Hasil/Tujuan)
ALGORITMA FRAME-STEWART (Multi-Peg Hanoi)
================================================================================
"""

# Dynamic Programming Memory Table
memo = {}

def hitung_langkah_frame_stewart(n, k):
    """
    Menghitung jumlah langkah minimum memindahkan n balok dengan k tiang.
    Rumus Frame-Stewart:
    M(n, k) = min_{1 <= m < n} [ 2 * M(m, k) + M(n - m, k - 1) ]
    """
    if n == 0:
        return 0
    if n == 1:
        return 1
    # Kasus klasik 3 tiang: 2^n - 1
    if k == 3:
        return (2 ** n) - 1
    
    key = (n, k)
    if key in memo:
        return memo[key]
    
    # Cari nilai pembagian m terbaik
    min_langkah = float('inf')
    best_m = 1
    for m in range(1, n):
        # 1. Pindahkan m balok teratas ke tiang transit menggunakan k tiang
        # 2. Pindahkan n-m balok tersisa ke tiang tujuan menggunakan k-1 tiang
        # 3. Pindahkan m balok dari transit ke tiang tujuan menggunakan k tiang
        biaya = 2 * hitung_langkah_frame_stewart(m, k) + hitung_langkah_frame_stewart(n - m, k - 1)
        if biaya < min_langkah:
            min_langkah = biaya
            best_m = m
            
    memo[key] = min_langkah
    return min_langkah


def main():
    n_balok = 100
    k_tiang = 10
    
    print("=" * 75)
    print("PERBANDINGAN REVOLUSIONER: MENARA HANOI 100 BALOK")
    print("=" * 75)
    print(f"Jumlah Balok : {n_balok} Balok")
    print(f"Konfigurasi  : 1 Tiang Asal, 8 Tiang Transit, 1 Tiang Hasil (Total 10 Tiang)\n")
    
    # Hitung untuk berbagai jumlah tiang
    print(f"{'Jumlah Tiang':<15} | {'Tiang Transit':<15} | {'Total Perpindahan':<35} | {'Estimasi Waktu':<20}")
    print("-" * 92)
    
    for tiang in range(3, 11):
        langkah = hitung_langkah_frame_stewart(n_balok, tiang)
        if tiang == 3:
            waktu_str = "4.01 x 10^22 Tahun"
            langkah_str = f"{langkah:,}"
        else:
            detik = langkah
            if detik < 60:
                waktu_str = f"{detik} Detik"
            elif detik < 3600:
                waktu_str = f"{detik/60:.1f} Menit"
            else:
                waktu_str = f"{detik/3600:.1f} Jam"
            langkah_str = f"{langkah:,} langkah"
            
        print(f"{tiang:<15} | {tiang-2:<15} | {langkah_str:<35} | {waktu_str:<20}")
        
    print("=" * 92)
    print("\nKESIMPULAN ILMIAH:")
    print("Dengan menambahkan 8 tiang transit (total 10 tiang), kompleksitas masalah")
    print("yang tadinya mustahil diselesaikan (1.26 x 10^30 langkah) runtuh secara dramatis")
    print("menjadi HANYA 601 LANGKAH (~10 menit selesai)!")


if __name__ == "__main__":
    main()
