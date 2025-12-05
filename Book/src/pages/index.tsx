import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './index.module.css';

type Highlight = {
  title: string;
  body: string;
  pill: string;
};

type Track = {
  title: string;
  description: string;
  items: string[];
};

const highlights: Highlight[] = [
  {
    title: 'Deployment-ready patterns',
    body: 'ROS 2 nodes, QoS defaults, and packaging recipes that move straight from sim to hardware.',
    pill: 'Architecture',
  },
  {
    title: 'Hands-on labs',
    body: 'Navigation stacks, sensor fusion, and control loops you can run locally or in the cloud.',
    pill: 'Labs',
  },
  {
    title: 'Evaluation recipes',
    body: 'Benchmark perception and autonomy with reproducible scenarios and clear success criteria.',
    pill: 'Evaluation',
  },
];

const tracks: Track[] = [
  {
    title: 'Kickstart your stack',
    description: 'Lay the foundation with ROS 2, navigation, and observability defaults.',
    items: ['Base install & workspace hygiene', 'Sensor bring-up and TF sanity checks', 'Quality-of-service and latency checklist'],
  },
  {
    title: 'Build intelligent behaviors',
    description: 'From perception to planning—train, test, and harden autonomy loops.',
    items: ['Perception pipelines with simulation bridges', 'Navigation tuning for indoor + outdoor routes', 'Failure recovery and watchdog patterns'],
  },
  {
    title: 'Ship with confidence',
    description: 'Release playbooks for CI, remote ops, and on-robot experimentation.',
    items: ['CI for ROS workspaces', 'Over-the-air rollouts and canaries', 'Teleop & observability for live fleets'],
  },
];

const resourceLinks = [
  {label: 'Read the docs', href: '/docs/intro', variant: 'primary'},
  {label: 'Explore the blog', href: '/blog', variant: 'secondary'},
  {label: 'View the repo', href: 'https://github.com/HackathonAiRebortics/Book', variant: 'ghost'},
];

export default function Home(): JSX.Element {
  return (
    <Layout
      description="AI Robotics Book — field-tested notes, labs, and patterns to build and ship intelligent robots faster.">
      <main className={styles.page}>
        <section className={styles.hero} id="hero">
          <div className={styles.heroContent}>
            <div className={styles.badge}>Fresh for builders · Robotics playbook</div>
            <h1>
              Build, test, and ship <span className={styles.accent}>AI robotics</span> with confidence.
            </h1>
            <p className={styles.lede}>
              A practical handbook for teams who want production-ready autonomy—covering ROS 2, perception, navigation,
              simulation, and release practices that survive the real world.
            </p>
            <div className={styles.actions}>
              <Link className={clsx('button button--primary', styles.primaryButton)} to="/docs/intro">
                Get started
              </Link>
              <Link className={clsx('button button--secondary', styles.secondaryButton)} to="/docs/realtime-qos">
                See a quick win
              </Link>
              <Link className={styles.textLink} to="/blog">
                Browse field notes →
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div>
                <div className={styles.statNumber}>20+</div>
                <div className={styles.statLabel}>Hands-on labs</div>
              </div>
              <div>
                <div className={styles.statNumber}>8</div>
                <div className={styles.statLabel}>Deployment checklists</div>
              </div>
              <div>
                <div className={styles.statNumber}>Real</div>
                <div className={styles.statLabel}>ROS 2 configs & QoS defaults</div>
              </div>
            </div>
          </div>
          <div className={styles.heroPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.pulse} />
              Mission-ready toolkit
            </div>
            <ul className={styles.panelList}>
              {highlights.map((item) => (
                <li key={item.title} className={styles.panelItem}>
                  <span className={styles.pill}>{item.pill}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.panelFooter}>
              <div>
                <div className={styles.panelTitle}>Prototype → Field</div>
                <p className={styles.panelDescription}>
                  Follow the tracks below to move from laptop to lab to live robots without losing reliability.
                </p>
              </div>
              <Link className={clsx('button button--primary', styles.smallButton)} to="#tracks">
                View tracks
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.resourceStrip}>
          {resourceLinks.map((resource) => (
            <Link
              key={resource.label}
              className={clsx(styles.resourceCard, styles[`resource-${resource.variant}`])}
              href={resource.href}>
              <span>{resource.label}</span>
              <span className={styles.arrow}>→</span>
            </Link>
          ))}
        </section>

        <section className={styles.tracks} id="tracks">
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Choose your path</p>
            <div>
              <h2>Learning tracks for fast-moving teams</h2>
              <p>
                Start where you are—whether you are standing up your first ROS 2 stack or shipping updates to a fleet,
                these guided tracks keep momentum high.
              </p>
            </div>
          </div>
          <div className={styles.trackGrid}>
            {tracks.map((track) => (
              <div key={track.title} className={styles.trackCard}>
                <div className={styles.trackHeader}>
                  <div className={styles.pill}>{track.title}</div>
                </div>
                <p className={styles.trackDescription}>{track.description}</p>
                <ul className={styles.trackList}>
                  {track.items.map((item) => (
                    <li key={item}>
                      <span className={styles.check}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link className={styles.inlineLink} to="/docs/intro">
                  Jump in →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.why} id="why">
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Why this guide</p>
            <div>
              <h2>Field-tested, pragmatic, and ready to ship</h2>
              <p>
                The AI Robotics Book distills hard-earned lessons from building and operating robots in real environments.
                You get patterns that survive flakiness, and experiments that de-risk launches.
              </p>
            </div>
          </div>
          <div className={styles.whyGrid}>
            <div className={styles.whyCard}>
              <h3>Fast ramp, clear wins</h3>
              <p>
                Each chapter ends with a lab or checklist so you can prove progress—perfect for hackathons and new hires
                alike.
              </p>
            </div>
            <div className={styles.whyCard}>
              <h3>Opinionated defaults</h3>
              <p>
                Sensible QoS values, launch templates, and monitoring hooks keep your stack consistent across teams and
                robots.
              </p>
            </div>
            <div className={styles.whyCard}>
              <h3>Built for iteration</h3>
              <p>
                Integrate simulation, CI, and telemetry early so you can ship experiments quickly and roll back safely.
              </p>
            </div>
          </div>
          <div className={styles.ctaBar}>
            <div>
              <p className={styles.kicker}>Ready to build?</p>
              <h3>Start with the quickstart and ship a stable navigation stack.</h3>
            </div>
            <div className={styles.ctaActions}>
              <Link className={clsx('button button--primary', styles.primaryButton)} to="/docs/intro">
                Begin the quickstart
              </Link>
              <Link className={clsx('button button--secondary', styles.secondaryButton)} to="/blog">
                See recent learnings
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

