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
      link: {type: 'doc', id: 'chapter-1-intro'},
      items: [
        'chapter-1/ros2-architecture',
        'chapter-1/realtime-qos',
        'chapter-1/middleware-foundations',
        'chapter-1/localization-navigation',
        'chapter-1/wireless-and-profiling',
      ],
    },
  ],
};

export default sidebars;
