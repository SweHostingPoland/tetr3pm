<p align="center"><br>
<a href="https://github.com/Lolo280374/tetrmp3"><img src="https://hackatime-badge.hackclub.com/U09CBF0DS4F/TETR.MP3"></a>
<a href="https://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg"></a>
<a href="https://devrant.com/rants/4149950/i-fucking-hate-mobile-development-i-already-manage-the-data-devops-infra-and-mos"><img src="https://img.shields.io/badge/you_need-a_keyboard-white"></a>
<a href="https://devrant.com/rants/4149950/i-fucking-hate-mobile-development-i-already-manage-the-data-devops-infra-and-mos"><img src="https://img.shields.io/badge/not_optimized-for_mobile-red"></a>
<br><p>

<h3 align="center">
Play tetris, but twist: an audio file of your choice controls the game's speed! (with it's BPM.)
</h3>

<h1 align="center">
Showcase: (screenshots.)
</h1>

<img width="1633" height="998" alt="gameplay" src="https://github.com/user-attachments/assets/1017d94e-5d7b-46a6-8771-f5a66f21dbbe" />

<img width="1716" height="1165" alt="fileimport" src="https://github.com/user-attachments/assets/1d3311ff-1cd9-43cf-be2c-cd7bb91846c3" />

## Table of contents

- [About](#about)
- [Supported file formats](#supported-file-formats)
- [How is BPM calculated](#how-is-bpm-calculated)
- [Keybinds](#keybinds)
- [Demo files](#demo-files)
- [Contributing](#contributing)
- [Reporting issues](#reporting-issues)
- [Credits](#credits)
- [license](#license)

## What is this project about?
for this week of Hack Club Siege, the theme was grid! so i decided let's go and make tetris, with a small twist!
the idea came from me that exact day playing TETR.IO, and realizing that i could just use tetris as a good game for the grid usage, and i got to work! i wanted to add a small twist, so I also added the fact that the game's speed changes with the BPM of the song, to make it like a difficulty level! sadly, it's often not that hard actually, but it's a good demo really!

in the end, this week, i'm actually happy of what i did, yay. and the UI is quite good when I think about it! simple and nice. plain dark mode. enough yapping i'm out byeeeeeeeeeeee.

## What file types are supported?
the following file formats are supported when it comes to importing audio files. note that technically, you can import any format, but compatibility isn't guaranteed!
<li> Vorbis (OGG)
<li> Waveform Audio (WAV)
<li> Free Lossless Audio Codec (FLAC)
<li> Advanced Audio Coding (AAC)
<li> MP3/MPEG-1 or 2 Audio Layers (MP3)
<li> Apple/MPEG-4 Audio (M4A)

## How is BPM calculated?
BPM calculation is not magic. it's math. i suck at maths, but that's all right. (also this implementation is truely not perfect, but it does the job...)

<br>to calculate the BPM, we use a library called MusicTempo. that library is avalaible on NPM, and it honestly simplifies our lives heavily. so we grab the music, put it thru musicTempo, which will give us the BPM of the song, and then yea!

then, to convert that BPM onto actual game speed, we just do the math of "60000 / <the bpm>", and that will give us a conversion from "beats per minutes" to "milliseconds per beat", exactly what our code expects, so then we just slam that value into the code and boom, speed changes with the BPM!

i'm no math expert. sorry if that explanation sucks. you can check the code yourself.

## What are the keybinds?
the game has rather simple keybinds. if you already played TETR.IO, you'll feel yourself (almost like at home), considering i'm also a TETR.IO player and I decided to reuse the same keybinds.

<li>left/right/down arrows - moves the active shape on the grid.
<li>up arrow - rotates the active shape on the grid.
<li>spacebar - make the active shape instantly reach the bottom, going to the next shape essentially.

## Demonstration files.
this was a nightmare. i had to find audio files to put in the game for the Hack Club Siege demo, issue is a lot of the songs nowadays are obviously not copyright-free or royalty-free. i decided to use the following songs...

<li> The Nymphaeum Part V by Angelwing;

why: this is the default MikoPBX hold music, and it gave me memories so i thought hey that'd be funny.

<li> デイドリーム (Daydream) by RINZO and MAHIRU;

why: i wanted a J-Pop song, but most of them are obviously going thru licensers like Sony, so that was a pain, so i just decided okay let's go with NCS. easy.

## Wanting to contribute?
to contribute, you can simply git clone this repository, and start editing the main HTML file of this project (or the javascript):

```sh
git clone https://github.com/Lolo280374/tetrmp3.git
cd tetrmp3
```

you may then request your modifications via a PR.

## Reporting an issue?
this is a community project, and your help is very much appreciated! if you notice anything wrong during your usage of this software, please report it to the [GitHub issues page](https://github.com/Lolo280374/tetrmp3/issues/)!

## Credits.
many thanks to these who without them, the project may have never seen the light of day (or it would just have sucked):

<br> - [Lucide Icons](https://lucide.dev/) - once again, absolutely goated icon pack, just works and super easy to import. love using it.
<br> - [MusicTempo](https://cdn.jsdelivr.net/npm/music-tempo/+esm) - used for calculating the BPM of each imported song, works pretty well!
<br> - [the artists that did the demo songs, check home page](https://tetr.lolodotzip.tech/) - well i definitly needed songs for the demo of the game, and thanks for making your stuff copyright-free!!
<br> - [JSfxr](https://sfxr.me/) - allowed me to make the sound effects by myself! super cool i had never heard of, but thanks!

and probably some others I forgotten.. sorry in advance, but thanks for being here!

## License.
this project is licensed under the MIT License which you may check [here](https://github.com/Lolo280374/tetrmp3/blob/master/LICENSE/).
<br>if you have any questions about this project or inquieries, please reach me at [lolodotzip@hackclub.app](mailto:lolodotzip@hackclub.app).
