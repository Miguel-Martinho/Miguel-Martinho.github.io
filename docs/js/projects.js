/*
  PROJECT DATA
  ------------
  Every project on the site lives in this list. To add a project, copy one
  block, give it a unique `id`, and fill in the fields. To add pictures to a
  project, put the file in the assets folder and add image("file-name.png")
  to its `media` list; they show up in the project view in the same order.

  Fields:
    id          unique, url-safe name (used in the link, e.g. index.html#project/nok)
    title       big title on the card and project view
    subtitle    one short line under the title
    year, role  shown as small facts in the project view (optional)
    tags        tools / skills, shown as chips (optional)
    thumbnail   what the card in the grid shows: image("…") or { type: "video", src }
    media       pictures in the project: image("…", "optional caption") or { type: "video", src }
    description list of paragraphs
    links       optional buttons: { label, url }
    comingSoon  true = card is shown greyed out and can't be opened yet
*/

const image = (file, caption) => ({ type: "image", src: `assets/${file}`, caption });

const PROJECTS = [
  {
    id: "nok",
    title: "Nok",
    subtitle: "3D point & click hidden object game",
    year: "2025",
    role: "Environment Artist · Programmer",
    tags: ["Environment Art", "Models", "Textures", "Shaders", "Gameplay Programming"],
    thumbnail: { type: "video", src: "assets/Nok.webm" },
    media: [
      { type: "video", src: "assets/Nok.webm" },
      image("nok-01.png"),
      image("nok-02.png"),
      image("nok-03.png"),
      image("nok-04.png"),
      image("nok-05.png"),
      image("nok-06.png"),
    ],
    description: [
      "Nok is a 3D point and click hidden object game I worked on throughout 2025.",
      "I mainly worked as an environment artist, but also had the pleasure and opportunity to code some new features for the game.",
    ],
    links: [],
  },
  {
    id: "vertex-guild-final",
    title: "Vertex Guild · Final",
    subtitle: "Corridor",
    year: "",
    role: "",
    tags: ["Models", "Textures", "Shaders"],
    thumbnail: image("final1.png"),
    media: [
      image("final.png"),
      image("final1.png"),
      image("corridor-01.webp"),
      image("corridor-02.webp"),
      image("corridor-03.png"),
      image("corridor-04.png"),
      image("corridor-05.png"),
      image("corridor-06.png"),
      image("corridor-07.png"),
      image("corridor-08.png"),
      image("corridor-09.png"),
      image("corridor-10.png"),
      image("corridor-11.png"),
    ],
    description: ["Add a description of this project here."],
  },
  {
    id: "vertex-guild-3-prop",
    title: "Vertex Guild · 3 Prop",
    subtitle: "Sword & Crown",
    year: "",
    role: "",
    tags: ["Models", "Textures", "Renders"],
    thumbnail: image("3prop.png"),
    media: [
      image("3prop.png"),
      image("sword-01.webp"),
      image("sword-02.webp"),
      image("sword-03.webp"),
    ],
    description: ["Add a description of this project here."],
  },
  {
    id: "vertex-guild-first",
    title: "Vertex Guild · First Project",
    subtitle: "Apothecary Box",
    year: "",
    role: "",
    tags: ["Models", "Textures", "Renders"],
    thumbnail: image("Box.jpg"),
    media: [
      image("Box.jpg"),
      image("box-02.jpg"),
      image("box-03.jpg"),
      image("box-04.jpg"),
      image("box-05.jpg"),
      image("box-06.jpg"),
    ],
    description: ["Add a description of this project here."],
  },
  {
    id: "modding",
    title: "Modding",
    subtitle: "7 Days to Die, Vermintide, Skyrim",
    year: "",
    role: "",
    tags: ["Models", "Textures", "Renders", "In-engine Implementation"],
    thumbnail: image("Computer.png"),
    media: [
      image("Computer1.png"),
      image("Computer.png"),
      image("computer-01.webp"),
      image("computer-02.webp"),
      image("computer-03.webp"),
      image("computer-04.webp"),
      image("computer-05.png"),
    ],
    description: ["Computer: a 7 Days to Die mod.", "Add more about your modding work here."],
  },
  // Coming soon: only a title is needed until the project is ready
  { id: "navictus", title: "Navictus", comingSoon: true },
  { id: "redacted-limb", title: "[Redacted LIMB]", comingSoon: true },
];
