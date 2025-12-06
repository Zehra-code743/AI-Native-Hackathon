# Data Model: Chapter 4 - Vision-Language-Action (VLA) Systems

**Branch**: `004-vla-chapter` | **Date**: 2025-01-27 | **Plan**: [plan.md](plan.md)

This document defines the key data entities for Chapter 4: Vision-Language-Action (VLA) Systems, based on the feature specification.

## Core Entities

### 1. VoiceCommand

Represents audio input containing a natural language command from the user.

*   **`id`**: `string` (UUID, unique identifier)
*   **`audio_data`**: `bytes` (raw audio file content)
*   **`audio_format`**: `enum` (`WAV`, `MP3`, `FLAC`)
*   **`duration_seconds`**: `float` (audio duration)
*   **`language`**: `string` (optional, ISO 639-1 code, e.g., "en")
*   **`timestamp`**: `datetime` (when command was received)
*   **`user_id`**: `string` (optional, for tracking)

### 2. TranscribedText

Text output from Whisper API representing the voice command.

*   **`id`**: `string` (UUID, links to VoiceCommand)
*   **`voice_command_id`**: `string` (foreign key to VoiceCommand)
*   **`text`**: `string` (transcribed text)
*   **`confidence`**: `float` (0.0-1.0, transcription confidence score)
*   **`language`**: `string` (detected language code)
*   **`timestamp`**: `datetime` (when transcription completed)

### 3. ActionGraph

Directed graph structure representing a sequence of ROS 2 actions with dependencies.

*   **`id`**: `string` (UUID)
*   **`nodes`**: `list<ActionNode>` (action nodes in the graph)
*   **`edges`**: `list<ActionEdge>` (dependencies between nodes)
*   **`metadata`**: `object` (source command, robot context, estimated duration)
*   **`validation_status`**: `enum` (`PENDING`, `VALID`, `INVALID`, `NEEDS_REVIEW`)
*   **`created_at`**: `datetime`

### 4. ActionNode

Individual action in the action graph.

*   **`id`**: `string` (unique within graph, e.g., "locate_cup", "navigate_to_cup")
*   **`type`**: `enum` (`NAVIGATE`, `GRASP`, `PLACE`, `PERCEPTION_QUERY`, `WAIT`, `CUSTOM`)
*   **`parameters`**: `dict<string, any>` (action-specific parameters)
*   **`dependencies`**: `list<string>` (IDs of nodes that must complete before this)
*   **`outputs`**: `dict<string, any>` (expected outputs, used by dependent nodes)
*   **`constraints`**: `list<SafetyConstraint>` (safety constraints for this action)
*   **`estimated_duration_seconds`**: `float`

### 5. ActionEdge

Represents a dependency or data flow between action nodes.

*   **`from_node_id`**: `string` (source node ID)
*   **`to_node_id`**: `string` (target node ID)
*   **`edge_type`**: `enum` (`SEQUENTIAL`, `DATA_FLOW`, `CONDITIONAL`)
*   **`condition`**: `string` (optional, for conditional edges)

### 6. SafetyConstraint

Safety rule that must be satisfied for an action to execute.

*   **`type`**: `enum` (`COLLISION_AVOIDANCE`, `JOINT_LIMIT`, `WORKSPACE_BOUNDARY`, `VELOCITY_LIMIT`, `FORCE_LIMIT`)
*   **`parameters`**: `dict<string, any>` (constraint-specific parameters)
*   **`severity`**: `enum` (`ERROR` - reject action, `WARNING` - clamp to safe value)

### 7. PerceptionData

Visual information from cameras and sensors.

*   **`id`**: `string` (UUID)
*   **`timestamp`**: `datetime` (when data was captured)
*   **`camera_frame_id`**: `string` (ROS 2 frame ID)
*   **`object_detections`**: `list<ObjectDetection>` (detected objects)
*   **`depth_map`**: `bytes` (optional, depth image data)
*   **`rgb_image`**: `bytes` (optional, RGB image data)

### 8. ObjectDetection

Detected object with location and metadata.

*   **`id`**: `string` (UUID)
*   **`object_name`**: `string` (e.g., "red cup", "table")
*   **`coordinates`**: `object` (3D position: `{x: float, y: float, z: float}`)
*   **`confidence`**: `float` (0.0-1.0, detection confidence)
*   **`bounding_box`**: `object` (2D bounding box: `{x_min, y_min, x_max, y_max}`)
*   **`timestamp`**: `datetime` (when detected)
*   **`detection_model`**: `string` (e.g., "yolo_v8", "isaac_perception")

### 9. ExecutionStatus

Status of action execution with feedback.

*   **`execution_id`**: `string` (UUID)
*   **`action_graph_id`**: `string` (foreign key to ActionGraph)
*   **`robot_id`**: `string` (target robot identifier)
*   **`status`**: `enum` (`PENDING`, `EXECUTING`, `COMPLETED`, `FAILED`, `CANCELLED`)
*   **`current_action_id`**: `string` (currently executing action node ID)
*   **`results`**: `list<ActionResult>` (results for each completed action)
*   **`error_message`**: `string` (if status is FAILED)
*   **`started_at`**: `datetime`
*   **`completed_at`**: `datetime` (nullable)
*   **`total_duration_seconds`**: `float` (nullable)

### 10. ActionResult

Result of executing a single action node.

*   **`action_id`**: `string` (node ID from ActionGraph)
*   **`status`**: `enum` (`SUCCESS`, `FAILED`, `CANCELLED`)
*   **`outputs`**: `dict<string, any>` (action outputs, used by dependent nodes)
*   **`duration_seconds`**: `float`
*   **`error_message`**: `string` (if status is FAILED)
*   **`timestamp`**: `datetime`

### 11. UserProfile

User preferences for content personalization.

*   **`user_id`**: `string` (unique identifier, can be session-based)
*   **`experience_level`**: `enum` (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`)
*   **`learning_style`**: `enum` (`VISUAL`, `TEXTUAL`, `HANDS_ON`, `MIXED`)
*   **`preferred_language`**: `string` (ISO 639-1 code, e.g., "en", "ur")
*   **`preferred_code_complexity`**: `enum` (`SIMPLIFIED`, `STANDARD`, `ADVANCED`)
*   **`created_at`**: `datetime`
*   **`updated_at`**: `datetime`

### 12. PersonalizedContent

Content variation adapted to user profile.

*   **`content_id`**: `string` (references chapter section or code example)
*   **`user_profile_id`**: `string` (foreign key to UserProfile)
*   **`original_content`**: `string` (original markdown/text)
*   **`personalized_content`**: `string` (adapted content)
*   **`adaptations_applied`**: `list<string>` (e.g., ["simplified_code", "extra_comments", "visual_diagrams"])
*   **`created_at`**: `datetime`

### 13. ChatMessage

Single message in RAG chatbot conversation.

*   **`id`**: `string` (UUID)
*   **`session_id`**: `string` (conversation session identifier)
*   **`message_type`**: `enum` (`USER_QUERY`, `BOT_RESPONSE`)
*   **`content`**: `string` (message text)
*   **`sources`**: `list<SourceCitation>` (for bot responses, references to chapter content)
*   **`timestamp`**: `datetime`
*   **`chapter_context`**: `string` (optional, current chapter ID)

### 14. SourceCitation

Reference to textbook content used in RAG response.

*   **`chapter_id`**: `string` (e.g., "chapter-4")
*   **`section`**: `string` (section title or heading)
*   **`relevance_score`**: `float` (0.0-1.0, how relevant the source is)
*   **`excerpt`**: `string` (optional, relevant text excerpt)

### 15. TranslationRequest

Request for content translation.

*   **`id`**: `string` (UUID)
*   **`source_text`**: `string` (English text to translate)
*   **`target_language`**: `enum` (`URDU` - currently only Urdu supported)
*   **`context`**: `string` (optional, e.g., "robotics_textbook", "code_comment")
*   **`preserve_technical_terms`**: `boolean` (whether to keep technical terms in English)
*   **`timestamp`**: `datetime`

### 16. TranslationResult

Result of translation with quality validation.

*   **`id`**: `string` (UUID, links to TranslationRequest)
*   **`translation_request_id`**: `string` (foreign key to TranslationRequest)
*   **`translated_text`**: `string` (translated content)
*   **`quality_score`**: `float` (0.0-1.0, translation quality score)
*   **`technical_terms_preserved`**: `list<string>` (terms kept in English)
*   **`validation_status`**: `enum` (`PENDING`, `PASSED`, `FAILED`, `NEEDS_REVIEW`)
*   **`translation_metadata`**: `object` (model used, validation details)
*   **`timestamp`**: `datetime`

## Relationships

- `VoiceCommand` → `TranscribedText` (one-to-one)
- `TranscribedText` → `ActionGraph` (one-to-one, via cognitive planning)
- `ActionGraph` → `ExecutionStatus` (one-to-many, multiple executions possible)
- `ExecutionStatus` → `ActionResult` (one-to-many)
- `ActionGraph` → `ActionNode` (one-to-many)
- `ActionNode` → `ActionNode` (many-to-many via ActionEdge dependencies)
- `PerceptionData` → `ObjectDetection` (one-to-many)
- `UserProfile` → `PersonalizedContent` (one-to-many)
- `ChatMessage` → `SourceCitation` (one-to-many, for bot responses)
- `TranslationRequest` → `TranslationResult` (one-to-one)

## State Transitions

### ActionGraph Validation
```
PENDING → VALID (after validation passes)
PENDING → INVALID (after validation fails)
INVALID → NEEDS_REVIEW (manual review required)
```

### ExecutionStatus
```
PENDING → EXECUTING (execution started)
EXECUTING → COMPLETED (all actions succeeded)
EXECUTING → FAILED (action failed, cannot continue)
EXECUTING → CANCELLED (user or system cancelled)
```

### ActionResult
```
[No explicit state] → SUCCESS (action completed successfully)
[No explicit state] → FAILED (action failed with error)
[No explicit state] → CANCELLED (action was cancelled)
```

## Validation Rules

### ActionGraph
- Must have at least one node
- All node dependencies must reference valid node IDs in the same graph
- No circular dependencies allowed
- All required parameters must be provided for each node type

### ActionNode
- Node ID must be unique within the graph
- Dependencies must reference existing nodes
- Parameters must match the expected schema for the node type
- Estimated duration must be positive

### ObjectDetection
- Coordinates must be within valid range (not NaN or infinite)
- Confidence must be between 0.0 and 1.0
- Object name must not be empty

### UserProfile
- Experience level must be one of the defined enum values
- Learning style must be one of the defined enum values
- Preferred language must be a valid ISO 639-1 code

## Data Storage

- **Neon PostgreSQL**: ChatMessage, UserProfile, PersonalizedContent, TranslationRequest, TranslationResult
- **Qdrant Vector DB**: Chapter content embeddings (for RAG retrieval)
- **In-Memory/Redis** (optional): ExecutionStatus, ActionResult (for real-time status)
- **Filesystem**: VoiceCommand audio files (temporary storage), code examples, chapter markdown

