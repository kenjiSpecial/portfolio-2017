export const initAssets = {
    base : './models',
    json : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'button'],
    mesh : [{'name' : 'button', 'count' : 2}],
    images : []
};
export const mainAssets = {
    base : './models',
    json : [
        'ButtonCol/main', 'ButtonCol/sub0', 'ButtonCol/sub0',
        'ButtonD/main', 'ButtonD/sub0', 'ButtonD/sub1',
        'ButtonE/main', 'ButtonE/sub0', 'ButtonE/sub1',
        'ButtonF/main', 'ButtonF/sub0', 'ButtonF/sub1',
        'ButtonG/main', 'ButtonG/sub0', 'ButtonG/sub1',
        'ButtonHi/main', 'ButtonHi/sub0', 'ButtonHi/sub1',
        'ButtonS/main', 'ButtonS/sub0', 'ButtonS/sub1',
        'ButtonT/main', 'ButtonT/sub0', 'ButtonT/sub1',
        'ButtonY/main', 'ButtonY/sub0', 'ButtonY/sub1',
        'ButtonBack/main', 'ButtonBack/sub0',
        'ButtonEnter/main', 'ButtonEnter/sub0',
        'hand',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 'u', 'w', 'x', 'v', 'z',
        'space'
    ],
    images : [
        {name : 'about', src : './images/about.jpg'},
        {name : 'about0', src : './images/about0.jpg'},
        {name : 'about1', src : './images/about1.jpg'},
        {name : 'about2', src : './images/about2.jpg'},
        {name : 'about3', src : './images/about3.jpg'},
        {name : 'about4', src : './images/about4.jpg'},
        {name : 'capitolcouture', src : './images/capitolcouture.jpg'},
        {name : 'sheepinator', src : './images/sheepinator.jpg'},
        {name : 'xfile', src : './images/xfile.jpg'},
        {name : 'more', src : './images/more.jpg'},
        {name : 'pnoise', src : './images/noise/pnoise.png'},
        {name : 'pnoise2', src : './images/noise/pnoise2.png'},
        {name : 'pnoise3', src : './images/noise/pnoise3.jpg'},
    ],
    mesh : []
};

export const characters =[
    {x: -14, z: -4.4, characters : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'button', 'button', 'ButtonBack']},
    {x: -13, z: -2.2, characters : ['q', 'w', 'ButtonE', 'r', 'ButtonT', 'ButtonY', 'u', 'i', 'o', 'p']},
    {x: -2.2 * 5 - 1.1, z: 0, characters : ['a', 'ButtonS', 'ButtonD', 'ButtonF', 'ButtonG', 'h', 'j', 'k', 'l', 'ButtonCol', 'ButtonHi', 'ButtonEnter']},
    {x: -11, z: 2.2, characters : ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'k', 'l' ]},
    {x: -2.2, z: 4.4, characters : ['space' ]}
];

export const keyboardMouseDown = {
    'a' : ['a', 's', 'd', 'f', 'g'],
    's' : ['a', 's', 'd', 'f', 'g'],
    'd' : ['a', 's', 'd', 'f', 'g'],
    'f' : ['a', 's', 'd', 'f', 'g'],
    'g' : ['a', 's', 'd', 'f', 'g'],
    'w' : ['w', 'e', 'r', 't', 'y'],
    'e' : ['w', 'e', 'r', 't', 'y'],
    'r' : ['w', 'e', 'r', 't', 'y'],
    't' : ['w', 'e', 'r', 't', 'y'],
    'y' : ['w', 'e', 'r', 't', 'y'],
}

export const keyboardDirectories = {
    'a' : 'about',
    's' : 'about',
    'd' : 'about',
    'f' : 'about',
    'g' : 'about',
    'about' : ['a', 's', 'd', 'f', 'g'],
    'w' : 'works',
    'e' : 'works',
    'r' : 'works',
    't' : 'works',
    'y' : 'works',
    'works' : ['w', 'e', 'r', 't', 'y'],
};

export const works = [
    {name : 'sheepinator', url: 'http://sheepinator.com/'},
    {name : 'xfile', url: 'http://archive.kenji-special.info/2016/01/x-files'},
    {name : 'capitolcouture', url: 'http://archive.kenji-special.info/2015/11/capitol-couture'},
    {name : 'more', url: 'http://archive.kenji-special.info/'},
]

export const aboutData = [
    'about0',
    'about1',
    'about2',
    'about3',
    'about4'
]