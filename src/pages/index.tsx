import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Physical AI & Humanoid Robotics Hackathon – Learn Robotics, AI, and Digital Twin Simulations">
      
      <main className={styles.mainContainer}>

        {/* Hero Section with overlay and animated background */}
        <section className={styles.heroSection} style={{ background: 'linear-gradient(135deg, #1f1c2c, #928dab)', color: '#fff', padding: '6rem 2rem', textAlign: 'center', borderRadius: '20px' }}>
          <img
            src="/img/ai rebortics.jpg"
            alt="Humanoid Robotics"
            style={{ width: '50%', height: 'auto', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', transition: 'transform 0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <h1 style={{ fontSize: '3rem', marginTop: '2rem' }}>🤖 Physical AI & Humanoid Robotics</h1>
          <p style={{ fontSize: '1.25rem', maxWidth: '700px', margin: '1rem auto' }}>
            Hackathon-driven course to master ROS 2, Gazebo/Unity, NVIDIA Isaac AI, 
            and VLA pipelines — with hands-on reproducible projects.
          </p>
          <Link className={styles.readButton} to="/docs/intro" style={{ padding: '0.75rem 2rem', borderRadius: '50px', background: '#ff6a00', color: '#fff', fontWeight: 'bold', textDecoration: 'none', transition: '0.3s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#ff8c42')}
            onMouseLeave={e => (e.currentTarget.style.background = '#ff6a00')}
          >Start the Hackathon Book →</Link>
        </section>

        {/* Modules Section as cards */}
        <section className={styles.modulesSection} style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', margin: '4rem 2rem' }}>
          {[
            { title: 'ROS 2', desc: 'Learn ROS 2 nodes, topics, services, and URDF to control humanoid robots.', color: '#6a1b9a' },
            { title: 'Digital Twin', desc: 'Create physics-based simulations and high-fidelity digital twins with Gazebo & Unity.', color: '#283593' },
            { title: 'NVIDIA Isaac', desc: 'Implement perception, navigation, and RL pipelines with Isaac Sim & ROS.', color: '#ff3d00' },
            { title: 'VLA Models', desc: 'Integrate LLMs and multi-modal AI for voice-to-action and object manipulation.', color: '#2e7d32' },
          ].map((module, idx) => (
            <div key={idx} style={{ background: module.color, color: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', transition: 'transform 0.3s', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-10px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{module.title}</h3>
              <p>{module.desc}</p>
            </div>
          ))}
        </section>

        {/* Features Section with hover effects */}
        <section className={styles.featuresSection} style={{ margin: '4rem 2rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.25rem', marginBottom: '2rem' }}>Explore Hackathon Features</h2>
          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>

            {[
            
              { img: '/img/Ro2.jpg', title: 'Digital Twin', desc: 'Gazebo & Unity build real-time digital twins.' },
              { img: '/img/Ro2 control.jpg', title: 'NVIDIA Isaac AI', desc: 'Perception, navigation, RL pipelines.' },
              { img: '/img/Ro2Model.jpg', title: 'VLA Models', desc: 'Convert vision & voice into robot actions.' },
            ].map((feature, idx) => (
              <div key={idx} style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', cursor: 'pointer', transition: 'transform 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img src={feature.img} alt={feature.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '1rem', background: '#fff' }}>
                  <h3 style={{ marginBottom: '0.5rem' }}>{feature.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#333' }}>{feature.desc}</p>
                </div>
              </div>
            ))}

          </div>
        </section>

      </main>
    </Layout>
  );
}