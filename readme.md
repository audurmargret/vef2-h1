# Hópverkefni 1 - Vefforritun 2

## Uppsetning
* npm install
* npm run setup
* npm run dev

## Notendur
### Admin notandi
* notendanafn: admin
* lykilorð: 123

### Venjulegur notandi
* notendanafn: notandi
* lykilorð: 321

## Dæmi um köll í vefþjónustu
### Sjónvarpsþættir
* `/tv`
  * `GET` skilar síðum af sjónvarpsþáttum með grunnupplýsingum
  * `POST` býr til nýjan sjónvarpsþátt, aðeins ef notandi er stjórnandi
* `/tv/:id`
  * `GET` skilar stöku sjónvarpsþáttum með grunnupplýsingum, meðal einkunn sjónvarpsþáttar, fjölda einkunna sem hafa verið skráðar fyrir sjónvarpsþátt, fylki af tegundum sjónvarpsþáttar (genres), fylki af seasons, rating notanda, staða notanda
  * `PATCH`, uppfærir sjónvarpsþátt, reit fyrir reit, aðeins ef notandi er stjórnandi
  * `DELETE`, eyðir sjónvarpsþátt, aðeins ef notandi er stjórnandi
* `/tv/:id/season/`
  * `GET` skilar fylki af öllum seasons fyrir sjónvarpsþátt
  * `POST` býr til nýtt í season í sjónvarpþætti, aðeins ef notandi er stjórnandi
* `/tv/:id/season/:id`
  * `GET` skilar stöku season fyrir þátt með grunnupplýsingum, fylki af þáttum
  * `DELETE`, eyðir season, aðeins ef notandi er stjórnandi
* `/tv/:id/season/:id/episode/`
  * `POST` býr til nýjan þátt í season, aðeins ef notandi er stjórnandi
* `/tv/:id/season/:id/episode/:id`
  * `GET` skilar upplýsingum um þátt
  * `DELETE`, eyðir þætti, aðeins ef notandi er stjórnandi
* `/genres`
  * `GET` skilar síðu af tegundum (genres)
  * `POST` býr til tegund, aðeins ef notandi er stjórnandi

  ### Notendur

* `/users/`
  * `GET` skilar síðu af notendum, aðeins ef notandi sem framkvæmir er stjórnandi
* `/users/:id`
  * `GET` skilar notanda, aðeins ef notandi sem framkvæmir er stjórnandi
  * `PATCH` breytir hvort notandi sé stjórnandi eða ekki, aðeins ef notandi sem framkvæmir er stjórnandi og er ekki að breyta sér sjálfum
* `/users/register`
  * `POST` staðfestir og býr til notanda. Skilar auðkenni og netfangi. Notandi sem búinn er til skal aldrei vera stjórnandi
* `/users/login`
  * `POST` með netfangi (eða notandanafni) og lykilorði skilar token ef gögn rétt
* `/users/me`
  * `GET` skilar upplýsingum um notanda sem á token, auðkenni og netfangi, aðeins ef notandi innskráður
  * `PATCH` uppfærir netfang, lykilorð eða bæði ef gögn rétt, aðeins ef notandi innskráður

### Sjónvarpsþættir og notendur

* `/tv/:id/rate`
  * `POST`, skráir einkunn innskráðs notanda á sjónvarpsþætti, aðeins fyrir innskráða notendur
  * `PATCH`, uppfærir einkunn innskráðs notanda á sjónvarpsþætti
  * `DELETE`, eyðir einkunn innskráðs notanda á sjónvarpsþætti
* `/tv/:id/state`
  * `POST`, skráir stöðu innskráðs notanda á sjónvarpsþætti, aðeins fyrir innskráða notendur
  * `PATCH`, uppfærir stöðu innskráðs notanda á sjónvarpsþætti
  * `DELETE`, eyðir stöðu innskráðs notanda á sjónvarpsþætti
* `/tv/:id`

## Heroku
* Linkur á heroku: https://vef2-h1-h15.herokuapp.com

## Nemendur
* Arnþór Guðmundsson, arg49@hi.is
* Auður Margrét Pálsdóttir, amp16@hi.is
* Katla Rún Ísfeld, kri9@hi.is
* Þröstur Almar Þrastarson, thth168@hi.is



