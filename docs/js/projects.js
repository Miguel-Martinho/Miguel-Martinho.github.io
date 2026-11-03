/*
  PROJECT DATA
  ------------
  Every project on the site lives in this list. To add a project, copy one
  block, give it a unique `id`, and fill in the fields.

  Pictures live in assets/projects/<project id>/. To add one, put the file in
  that folder (lowercase name, hyphens, e.g. corridor-12.webp) and add
  image("<project id>/<file>") to the project's `media` list; they show up in
  the project view in the same order.

  Fields:
    id          unique, url-safe name, also the project's assets folder
                (used in the link too, e.g. index.html#project/nok)
    title       big title on the card and project view
    subtitle    one short line under the title
    year, role  shown as small facts in the project view (optional)
    tags        tools / skills, shown as chips (optional)
    thumbnail   what the card in the grid shows: image("…") or video("…")
    media       pictures in the project: image("…", "optional caption") or video("…")
    description list of paragraphs
    links       optional buttons: { label, url }
    comingSoon  true = card is shown greyed out and can't be opened yet
*/

const image = (file, caption) => ({ type: "image", src: `assets/projects/${file}`, caption });
const video = (file, caption) => ({ type: "video", src: `assets/projects/${file}`, caption });

const PROJECTS = [
  {
    id: "nok",
    title: "Nok",
    subtitle: "3D point & click hidden object game",
    year: "2025",
    role: "Environment Artist · Programmer",
    tags: ["Environment Art", "Models", "Textures", "Shaders", "Gameplay Programming"],
    thumbnail: video("nok/nok.webm"),
    media: [
      video("nok/nok.webm"),
      image("nok/nok-01.webp"),
      image("nok/nok-02.webp"),
      image("nok/nok-03.webp"),
      image("nok/nok-04.webp"),
      image("nok/nok-05.webp"),
      image("nok/nok-06.webp"),
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
    thumbnail: image("vertex-guild-final/corridor-render-02.webp"),
    media: [
      image("vertex-guild-final/corridor-render-01.webp"),
      image("vertex-guild-final/corridor-render-02.webp"),
      image("vertex-guild-final/corridor-01.webp"),
      image("vertex-guild-final/corridor-02.webp"),
      image("vertex-guild-final/corridor-03.webp"),
      image("vertex-guild-final/corridor-04.webp"),
      image("vertex-guild-final/corridor-05.webp"),
      image("vertex-guild-final/corridor-06.webp"),
      image("vertex-guild-final/corridor-07.webp"),
      image("vertex-guild-final/corridor-08.webp"),
      image("vertex-guild-final/corridor-09.webp"),
      image("vertex-guild-final/corridor-10.webp"),
      image("vertex-guild-final/corridor-11.webp"),
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
    thumbnail: image("vertex-guild-3-prop/sword-render.webp"),
    media: [
      image("vertex-guild-3-prop/sword-render.webp"),
      image("vertex-guild-3-prop/sword-01.webp"),
      image("vertex-guild-3-prop/sword-02.webp"),
      image("vertex-guild-3-prop/sword-03.webp"),
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
    thumbnail: image("vertex-guild-first/box-01.webp"),
    media: [
      image("vertex-guild-first/box-01.webp"),
      image("vertex-guild-first/box-02.webp"),
      image("vertex-guild-first/box-03.webp"),
      image("vertex-guild-first/box-04.webp"),
      image("vertex-guild-first/box-05.webp"),
      image("vertex-guild-first/box-06.webp"),
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
    thumbnail: image("modding/computer-screenshot-01.webp"),
    media: [
      image("modding/computer-screenshot-02.webp"),
      image("modding/computer-screenshot-01.webp"),
      image("modding/computer-01.webp"),
      image("modding/computer-02.webp"),
      image("modding/computer-03.webp"),
      image("modding/computer-04.webp"),
      image("modding/computer-05.webp"),
    ],
    description: ["Computer: a 7 Days to Die mod.", "Add more about your modding work here."],
  },
  // Coming soon: only a title is needed until the project is ready
  { id: "navictus", title: "Navictus", comingSoon: true },
  { id: "redacted-limb", title: "[Redacted LIMB]", comingSoon: true },
];
