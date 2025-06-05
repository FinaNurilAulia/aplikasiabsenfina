# aplikasiabsenfina

This template should help get you started developing with Vue 3 in Vite.

## buat project baru
1. pastikan sudah install nodejs dan github desktop.
2. buka terminal dan pilih folder tempat project.
3. jalankan 'npm create vue@latest'
4. Project name isi dengan 'aplikasiabsenfina'

##### menjalankan project
1. buka folder web1250 di vscode.
2. buka terminal yang ada di vscode dengan ctrl+.
3. install dependency project dengan menjalankan npm install di terminal.
4. jalankan project dengan menjalankan npe run dev' di terminal.

#### setting github di vscode
1. buat repository di github dengan nama 'aplikasiabsenfina'.
2. masuk ke menu source controle di github dan pilih "initialize repository.
3. masukkan "README.md ke stage dan commit
4. tambahkan remote github.
5. publish/push/sync ke github

#### setting cloudflare
1. install wrangler dan cloudflare/vite-plugin dengn menjalankan 'npm install -o @cloudflare/vite-plugin wrangler' di terminal.
2. setting cloudflare di 'vite.cofig.js'.
3. buat dan setting 'wrangler.jsonc'
4. buat file 'index.js' di folder api untuk backend.
5. create worker di cloudflare dengan memilih 'import a repository' dan pilih 'aplikasiabsenfina'.
6. biarkan setting standart pilih build.