/*
  DotBIM JavaScript Library
  -------------------------
  A standalone library to read from and write to .bim files.

  Dependencies: None (pure JavaScript)

  Documentation:
  - Class and Parameter Descriptions included inline.
  - parseBim(jsonString): Parses .bim JSON into BimFile.
  - encodeBim(bimFile): Serializes a BimFile to JSON string.
*/

class Color {
  constructor(r, g, b, a) {
    this.r = r; // Red (0-255)
    this.g = g; // Green (0-255)
    this.b = b; // Blue (0-255)
    this.a = a; // Alpha (0-255)
  }
}

class Vector {
  constructor(x, y, z) {
    this.x = x; // X-axis coordinate
    this.y = y; // Y-axis coordinate
    this.z = z; // Z-axis coordinate
  }
}

class Rotation {
  constructor(qx, qy, qz, qw) {
    this.qx = qx; // Quaternion X
    this.qy = qy; // Quaternion Y
    this.qz = qz; // Quaternion Z
    this.qw = qw; // Quaternion W
  }
}

class Mesh {
  constructor(meshId, coordinates, indices) {
    this.meshId = meshId; // Mesh unique ID
    this.coordinates = coordinates; // Vertex coordinates
    this.indices = indices; // Mesh face indices
  }
}

class Info {
  constructor(data) {
    Object.assign(this, data); // Metadata key-value pairs
  }
}

class Element {
  constructor(guid, meshId, vector, rotation, type, color, faceColors, info) {
    this.guid = guid; // Unique identifier (GUID)
    this.meshId = meshId; // Associated mesh ID
    this.vector = vector; // Position (Vector)
    this.rotation = rotation; // Orientation (Rotation)
    this.type = type; // Element type string
    this.color = color; // Primary color (Color)
    this.faceColors = faceColors; // Optional per-face colors
    this.info = info; // Additional metadata (Info)
  }
}

class BimFile {
  constructor(schemaVersion, info, meshes, elements) {
    this.schemaVersion = schemaVersion; // BIM schema version
    this.info = info; // File metadata (Info)
    this.meshes = meshes; // Array of Mesh objects
    this.elements = elements; // Array of Element objects
  }
}

function parseBim(jsonString) {
  const data = JSON.parse(jsonString);
  return new BimFile(
    data.schema_version,
    new Info(data.info),
    data.meshes.map(m => new Mesh(m.mesh_id, m.coordinates, m.indices)),
    data.elements.map(e =>
      new Element(
        e.guid,
        e.mesh_id,
        new Vector(e.vector.x, e.vector.y, e.vector.z),
        new Rotation(e.rotation.qx, e.rotation.qy, e.rotation.qz, e.rotation.qw),
        e.type,
        new Color(e.color.r, e.color.g, e.color.b, e.color.a),
        e.face_colors || null,
        new Info(e.info)
      )
    )
  );
}

function encodeBim(bimFile) {
  return JSON.stringify(bimFile, null, 2); // Serialize BIM file to JSON
}

export { Color, Vector, Rotation, Mesh, Info, Element, BimFile, parseBim, encodeBim };
