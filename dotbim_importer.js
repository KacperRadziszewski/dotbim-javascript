/*
  DotBIM JavaScript Library with GLTF Export
  ------------------------------------------
  A standalone library to read from, write to, and convert .bim files to GLTF.
*/

class Color { constructor(r, g, b, a) { this.r = r; this.g = g; this.b = b; this.a = a; } }
class Vector { constructor(x, y, z) { this.x = x; this.y = y; this.z = z; } }
class Rotation { constructor(qx, qy, qz, qw) { this.qx = qx; this.qy = qy; this.qz = qz; this.qw = qw; } }
class Mesh { constructor(meshId, coordinates, indices) { this.meshId = meshId; this.coordinates = coordinates; this.indices = indices; } }
class Info { constructor(data) { Object.assign(this, data); } }
class Element { constructor(guid, meshId, vector, rotation, type, color, faceColors, info) { this.guid = guid; this.meshId = meshId; this.vector = vector; this.rotation = rotation; this.type = type; this.color = color; this.faceColors = faceColors; this.info = info; } }
class BimFile { constructor(schemaVersion, info, meshes, elements) { this.schemaVersion = schemaVersion; this.info = info; this.meshes = meshes; this.elements = elements; } }

function parseBim(jsonString) {
    const data = JSON.parse(jsonString);
    return new BimFile(
        data.schema_version,
        new Info(data.info),
        data.meshes.map(m => new Mesh(m.mesh_id, m.coordinates, m.indices)),
        data.elements.map(e => new Element(
            e.guid, e.mesh_id,
            new Vector(e.vector.x, e.vector.y, e.vector.z),
            new Rotation(e.rotation.qx, e.rotation.qy, e.rotation.qz, e.rotation.qw),
            e.type, new Color(e.color.r, e.color.g, e.color.b, e.color.a),
            e.face_colors || null, new Info(e.info))
        )
    );
}

function encodeBim(bimFile) {
    return JSON.stringify(bimFile, null, 2);
}

function convertBimToGLTF(bimFile) {
    const nodes = bimFile.elements.map(e => ({
        name: e.guid,
        translation: [e.vector.x, e.vector.y, e.vector.z],
        rotation: [e.rotation.qx, e.rotation.qy, e.rotation.qz, e.rotation.qw]
    }));

    return JSON.stringify({
        asset: { version: "2.0", generator: "DotBIM-to-GLTF-Converter" },
        scenes: [{ nodes: nodes.map((_, i) => i) }],
        nodes,
    }, null, 2);
}

export { Color, Vector, Rotation, Mesh, Info, Element, BimFile, parseBim, encodeBim, convertBimToGLTF };
