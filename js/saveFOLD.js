/**
 * Created by amandaghassaei on 5/6/17.
 */

function saveFOLD(){

    var geo = new THREE.Geometry().fromBufferGeometry( globals.Model3D.getGeometry() );

    if (geo.vertices.length == 0 || geo.faces.length == 0) {
        globals.warn("No geometry to save.");
        return;
    }

    if (globals.exportScale != 1){
        for (var i=0;i<geo.vertices.length;i++){
            geo.vertices[i].multiplyScalar(globals.exportScale);
        }
    }

    var filename = $("#foldFilename").val();
    if (filename == "") filename = globals.filename;

    var json = {
        file_spec: 1,
        file_creator: "Origami Simulator: http://git.amandaghassaei.com/OrigamiSimulator/",
        file_author: $("#foldAuthor").val(),
        frame_title: filename,
        frame_classes: ["singleModel"],
        frame_attributes: ["3D"],
        frame_unit: globals.foldUnits,
        vertices_coords: [],
        edges_vertices: [],
        edges_assignment: [],
        faces_vertices: []
    };

    for (var i=0;i<geo.vertices.length;i++){
        var vertex = geo.vertices[i];
        json.vertices_coords.push([vertex.x, vertex.y, vertex.z]);
    }

    var useTriangulated = globals.triangulateFOLDexport;
    var fold;
    if (useTriangulated) fold = globals.PatternImporter.getFoldData();
    else fold = globals.PatternImporter.getPreProcessedFoldData();
    json.edges_vertices = fold.edges_vertices;
    var assignment = [];
    for (var i=0;i<fold.edges_assignment.length;i++){
        if (fold.edges_assignment[i] == "C") assignment.push("B");
        else assignment.push(fold.edges_assignment[i]);
    }
    json.edges_assignment = assignment;
    json.faces_vertices = fold.faces_vertices;

    if (globals.exportFoldAngle){
        json.edges_foldAngles = fold.edges_foldAngles;
    }

    var blob = new Blob([JSON.stringify(json, null, 4)], {type: 'application/octet-binary'});
    saveAs(blob, filename + ".fold");
}