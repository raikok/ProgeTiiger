# ProgeTiiger
 ProgeTiigri taotlusvooru andmete töötlemine ja visualiseerimine interaktiivsel kaardil

#### Veebirakendus on saadaval URLil: http://146.190.178.52:3000/map


### Lokaalne käivitus

1. Veendu, et olete alla laadinud ja installeerinud Docker Desktop rakenduse (https://www.docker.com/products/docker-desktop/).
2. Käivitage Docker Desktop.
3. (Valikuline samm) Muuda ära andmebaasi parool.
    1. Juurkaustas docker-compose.yml failis on võtmed POSTGRES_PASSWORD ja PGPASSWORD, mida võib endale sobivaks muuta (mõlemal peab olema sama väärtus).
4. Käivitage repositooriumi juurkaustas käsk 'docker-compose up --build'.
5. Kui konteiner on ülesseadmise protsessi lõpetanud, siis rakendus on kättesaadav aadressil http://localhost:3050/map.