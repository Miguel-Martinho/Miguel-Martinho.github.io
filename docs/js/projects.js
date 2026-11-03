/*
  PROJECT DATA
  ------------
  Every project on the site lives in this list. To add a project, copy one
  block, give it a unique `id`, and fill in the fields. To add pictures to a
  project, add entries to its `media` list; they show up in the popup's
  carousel (arrows, dots, swipe on mobile) in the same order.

  Fields:
    id          unique, url-safe name (used in the link, e.g. index.html#project/nok)
    title       big title on the card and popup
    subtitle    one short line under the title
    year, role  shown as small facts in the popup (optional)
    tags        tools / skills, shown as chips (optional)
    thumbnail   what the card in the grid shows: { type: "image" | "video", src }
    media       carousel slides: { type: "image" | "video", src, caption? }
    description list of paragraphs
    links       optional buttons: { label, url }
    comingSoon  true = card is shown greyed out and can't be opened yet
*/

const PROJECTS = [
  {
    id: "nok",
    title: "Nok",
    subtitle: "3D point & click hidden object game",
    year: "2025",
    role: "Environment Artist · Programmer",
    tags: ["Environment Art", "3D Modelling", "Gameplay Code"],
    thumbnail: { type: "video", src: "assets/Nok.webm" },
    media: [
      { type: "video", src: "assets/Nok.webm" },
      { type: "image", src: "assets/Box.jpg" },
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
    subtitle: "Environment scene",
    year: "",
    role: "",
    tags: [],
    thumbnail: { type: "image", src: "assets/final1.png" },
    media: [
      { type: "image", src: "assets/final.png" },
      { type: "image", src: "assets/final1.png" },
    ],
    description: ["Add a description of this project here."],
  },
  {
    id: "vertex-guild-3-prop",
    title: "Vertex Guild · 3 Prop",
    subtitle: "Prop study",
    year: "",
    role: "",
    tags: [],
    thumbnail: { type: "image", src: "assets/3prop.png" },
    media: [{ type: "image", src: "assets/3prop.png" }],
    description: ["Add a description of this project here."],
  },
  {
    id: "modding",
    title: "Modding",
    subtitle: "7 Days to Die, Vermintide, Skyrim",
    year: "",
    role: "",
    tags: ["Modding"],
    thumbnail: { type: "image", src: "assets/Computer.png" },
    media: [
      { type: "image", src: "assets/Computer1.png" },
      { type: "image", src: "assets/Computer.png" },
    ],
    description: ["Add a description of this project here."],
  },
  // Coming soon: only a title is needed until the project is ready
  { id: "vertex-guild-first", title: "Vertex Guild · First Project", comingSoon: true },
  { id: "navictus", title: "Navictus", comingSoon: true },
  { id: "redacted-limb", title: "[Redacted LIMB]", comingSoon: true },
];
