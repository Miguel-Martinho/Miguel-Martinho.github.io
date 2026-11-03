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
    category    "portfolio" or "experience": which section of the page it appears in
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
    category: "experience",
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
    category: "portfolio",
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
    category: "portfolio",
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
    category: "portfolio",
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
    id: "7-days-to-die-computer",
    category: "portfolio",
    title: "7 Days to Die Computer",
    subtitle: "Game mod",
    year: "",
    role: "",
    tags: ["Models", "Textures", "Renders", "In-engine Implementation"],
    thumbnail: image("7-days-to-die-computer/computer-screenshot-01.webp"),
    media: [
      image("7-days-to-die-computer/computer-screenshot-02.webp"),
      image("7-days-to-die-computer/computer-screenshot-01.webp"),
      image("7-days-to-die-computer/computer-01.webp"),
      image("7-days-to-die-computer/computer-02.webp"),
      image("7-days-to-die-computer/computer-03.webp"),
      image("7-days-to-die-computer/computer-04.webp"),
      image("7-days-to-die-computer/computer-05.webp"),
    ],
    description: ["A computer made for a 7 Days to Die mod, from modelling and texturing to getting it working in the game.", "Add more about this project here."],
  },
  {
    id: "skyrim-modding",
    category: "experience",
    title: "Skyrim Modding",
    subtitle: "Creation Kit level design",
    year: "",
    role: "",
    tags: ["Creation Kit", "Modular Workflows", "Lighting & FX"],
    thumbnail: image("skyrim-modding/skyrim-01.jpg"),
    media: [image("skyrim-modding/skyrim-01.jpg")],
    description: [
      "Modding Skyrim with the Creation Kit gave me a better understanding of modular workflows, and of how much light and FX shape the mood of a scene.",
    ],
  },
  {
    id: "vermintide-modding",
    category: "experience",
    title: "Vermintide 2 Modding",
    subtitle: "Weapon mods",
    year: "",
    role: "",
    tags: ["Blender", "Models", "Textures", "Shaders"],
    thumbnail: image("vermintide-modding/vermintide-01.png"),
    media: [
      image("vermintide-modding/vermintide-01.png"),
      image("vermintide-modding/vermintide-02.png"),
      image("vermintide-modding/vermintide-03.webp"),
      image("vermintide-modding/vermintide-04.webp"),
      image("vermintide-modding/vermintide-05.webp"),
      image("vermintide-modding/vermintide-06.webp"),
      image("vermintide-modding/vermintide-07.png"),
      image("vermintide-modding/vermintide-08.webp"),
    ],
    description: [
      "Weapon mods for Warhammer: Vermintide 2, modelled in Blender and brought into the game.",
      "Modding for Vermintide taught me to pick up and match an existing game's art style quickly, and to use custom shaders and add-ons in Blender and Substance Painter.",
    ],
  },
  // Coming soon: only a title is needed until the project is ready
  { id: "navictus", category: "experience", title: "Navictus", comingSoon: true },
  { id: "redacted", category: "experience", title: "[Redacted]", comingSoon: true },
];
