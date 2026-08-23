async function openProject(project) {

    const response = await fetch(project);

    const content = await response.text();

    document.getElementById("projectContent").innerHTML = content;

    document.getElementById("projectPopup").style.display = "flex";
}


function closeProject() {

    document.getElementById("projectPopup").style.display = "none";

    document.getElementById("projectContent").innerHTML = "";
}


//Vertex Guild first project
//Vertex Guild 3 prop
//Vertex Guild Final
//Navictus
//[Redacted LIMB]
//Modding Vermintide, Skyrim, / days to die
