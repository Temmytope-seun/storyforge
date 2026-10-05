import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ProjectWithRelations } from "@/lib/types";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: "#555555",
    marginBottom: 16,
  },
  sceneHeader: {
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: "1pt solid #cccccc",
  },
  sceneTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  sceneMeta: {
    fontSize: 9,
    color: "#555555",
    marginTop: 2,
  },
  shotRow: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  frameImage: {
    width: 160,
    height: 100,
    objectFit: "cover",
    backgroundColor: "#eeeeee",
    borderRadius: 4,
  },
  framePlaceholder: {
    width: 160,
    height: 100,
    backgroundColor: "#eeeeee",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  shotDetails: {
    flex: 1,
  },
  shotHeading: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  shotMeta: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 4,
  },
  shotDescription: {
    fontSize: 10,
    marginBottom: 3,
  },
  dialogue: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#333333",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 32,
    right: 32,
    fontSize: 8,
    color: "#999999",
    textAlign: "center",
  },
});

export function StoryboardDocument({
  project,
  frameBuffers,
}: {
  project: ProjectWithRelations;
  /** Map of imageUrl (e.g. "/generated/x/y.png") -> file bytes, read server-side ahead of render. */
  frameBuffers: Map<string, Buffer>;
}) {
  return (
    <Document title={project.title}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.subtitle}>
          {[project.genre, project.tone, project.visualStyle, project.aspectRatio]
            .filter(Boolean)
            .join(" · ")}
        </Text>

        {project.scenes.map((scene) => (
          <View key={scene.id}>
            <View style={styles.sceneHeader}>
              <Text style={styles.sceneTitle}>
                Scene {scene.sceneNumber}: {scene.title}
              </Text>
              <Text style={styles.sceneMeta}>
                {[
                  scene.location,
                  scene.timeOfDay,
                  scene.mood,
                  scene.duration ? `${scene.duration}s` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </Text>
            </View>

            {scene.shots.map((shot) => {
              const buffer = shot.frame?.imageUrl
                ? frameBuffers.get(shot.frame.imageUrl)
                : undefined;

              return (
                <View key={shot.id} style={styles.shotRow} wrap={false}>
                  {buffer ? (
                    // eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image, not an HTML img
                    <Image style={styles.frameImage} src={buffer} />
                  ) : (
                    <View style={styles.framePlaceholder}>
                      <Text style={{ fontSize: 8, color: "#999999" }}>
                        No frame generated
                      </Text>
                    </View>
                  )}
                  <View style={styles.shotDetails}>
                    <Text style={styles.shotHeading}>
                      Shot {shot.shotNumber}: {shot.shotType}
                    </Text>
                    <Text style={styles.shotMeta}>
                      {[
                        shot.cameraAngle,
                        shot.lens,
                        shot.movement,
                        shot.duration ? `${shot.duration}s` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </Text>
                    <Text style={styles.shotDescription}>
                      {shot.description}
                    </Text>
                    {shot.dialogue && (
                      <Text style={styles.dialogue}>&ldquo;{shot.dialogue}&rdquo;</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        ))}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `StoryForge AI — ${project.title} — Page ${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}
