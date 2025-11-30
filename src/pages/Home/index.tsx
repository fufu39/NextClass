import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Typography } from 'antd'
import { LoginOutlined } from '@ant-design/icons'
import styles from './index.module.scss'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'

const { Title } = Typography

const KEYWORDS = [
  { text: "Bold.", color: "wordRed" },
  { text: "Fresh.", color: "wordOrange" },
  { text: "Smart.", color: "wordGreen" },
  { text: "Fast.", color: "wordRed" },
  { text: "Easy.", color: "wordOrange" },
  { text: "Clean.", color: "wordGreen" },
  { text: "Vivid.", color: "wordRed" },
  { text: "Light.", color: "wordOrange" },
  { text: "Swift.", color: "wordGreen" },
]

const Home = () => {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)

  // Parallax mouse values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 10, stiffness: 120, mass: 0.5 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  const x1 = useTransform(mouseXSpring, [0, window.innerWidth], [-30, 30])
  const y1 = useTransform(mouseYSpring, [0, window.innerHeight], [-30, 30])

  const x2 = useTransform(mouseXSpring, [0, window.innerWidth], [40, -40])
  const y2 = useTransform(mouseYSpring, [0, window.innerHeight], [40, -40])

  const x3 = useTransform(mouseXSpring, [0, window.innerWidth], [-20, 20])
  const y3 = useTransform(mouseYSpring, [0, window.innerHeight], [-20, 20])

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % 3)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  const currentKeywords = KEYWORDS.slice(index * 3, index * 3 + 3)

  return (
    <div className={styles.hero} onMouseMove={handleMouseMove}>
      <header className={styles.header}>
        <Button
          type="primary"
          shape="round"
          size="large"
          className={styles.loginBtn}
          onClick={() => navigate('/login')}
          icon={<LoginOutlined />}
        >
          Sign In
        </Button>
      </header>

      <div className={styles.container}>
        <motion.div
          className={styles.visuals}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className={`${styles.blob} ${styles.blobRed}`}
            style={{ x: x1, y: y1 }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          <motion.div
            className={`${styles.blob} ${styles.blobGreen}`}
            style={{ x: x2, y: y2 }}
            animate={{
              scale: [1.1, 1, 1.1],
            }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />
          <motion.div
            className={`${styles.blob} ${styles.blobOrange}`}
            style={{ x: x3, y: y3 }}
            animate={{
              scale: [0.9, 1.15, 0.9],
            }}
            transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
          />
          <div className={styles.noise} />
          <div className={styles.gridOverlay} />
        </motion.div>

        <motion.div
          className={styles.content}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Title className={styles.title}>NextClass</Title>
          <div className={styles.keywordsContainer}>
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className={styles.keywordsWrapper}
                initial={{ x: 60, opacity: 0, filter: 'blur(10px)' }}
                animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ x: -60, opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {currentKeywords.map((k, i) => (
                  <span key={`${index}-${i}`} className={styles[k.color]}>{k.text}</span>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
