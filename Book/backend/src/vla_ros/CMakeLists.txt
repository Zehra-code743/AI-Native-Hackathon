cmake_minimum_required(VERSION 3.8)
project(vla_ros)

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic)
endif()

# Find dependencies
find_package(ament_cmake REQUIRED)
find_package(std_msgs REQUIRED)
find_package(geometry_msgs REQUIRED)
find_package(sensor_msgs REQUIRED)
find_package(builtin_interfaces REQUIRED)

# Generate messages
rosidl_generate_interfaces(${PROJECT_NAME}
  "msg/ActionGraph.msg"
  "msg/ActionNode.msg"
  "msg/ActionEdge.msg"
  "msg/SafetyConstraint.msg"
  "msg/ExecutionStatus.msg"
  "msg/ActionResult.msg"
  "msg/ObjectQuery.msg"
  "msg/ObjectDetection.msg"
  "srv/ValidateActionGraph.srv"
  "srv/QueryObject.srv"
  "action/ExecuteActionGraph.action"
  DEPENDENCIES
    std_msgs
    geometry_msgs
    sensor_msgs
    builtin_interfaces
)

if(BUILD_TESTING)
  find_package(ament_lint_auto REQUIRED)
  ament_lint_auto_find_test_dependencies()
endif()

ament_package()

