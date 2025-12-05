import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Chapter 1: Robotic Nervous System',
      link: {type: 'doc', id: 'chapter-1-intro'}, // Assuming 'chapter-1-intro' maps to intro.md in docs folder
      items: [
        'chapter-1/ros2-architecture',
        'chapter-1/realtime-qos',
        'chapter-1/middleware-foundations',
        'chapter-1/localization-navigation',
        'chapter-1/wireless-and-profiling',
        // New Chapter 1 items
        'chapter-1/publish-subscribe-communication',
        'chapter-1/request-response-communication',
        'chapter-1/goal-oriented-communication',
        'chapter-1/configuration-management',
        'chapter-1/hands-on-lab-build-your-first-ros-2-system',
      ],
    },
    {
      type: 'category',
      label: 'Chapter 2: Practical ROS 2 Development',
      items: [
        'chapter-2/launch-files-orchestrating-multi-node-systems',
        'chapter-2/message-and-service-definitions',
        'chapter-2/debugging-ros-2-systems',
        'chapter-2/ros-2-logging-and-node-lifecycle',
        'chapter-2/urdf-describing-robot-morphology',
        'chapter-2/rviz-visualizing-robots-and-sensor-data',
        'chapter-2/hands-on-lab-design-a-humanoid-urdf',
        'chapter-2/time-in-ros-2-clocks-and-timing',
      ],
    },
    {
      type: 'category',
      label: 'Chapter 3: Integration & Capstone Preparation',
      items: [
        'chapter-3/building-a-humanoid-control-architecture',
        'chapter-3/sensor-drivers-integrating-hardware',
        'chapter-3/motor-controllers-actuating-robots',
        'chapter-3/capstone-preview-the-autonomous-humanoid-system',
        'chapter-3/hands-on-lab-integration-challenge',
      ],
    },
    {
      type: 'category',
      label: 'Course Information',
      items: [
        'meta/assessments',
        'meta/technical-requirements',
        'meta/reading-materials',
        'meta/common-mistakes-to-avoid',
        'meta/chapter-summary',
      ],
    },
  ],
};

export default sidebars;
