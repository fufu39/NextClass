import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import styles from './index.module.scss'

const NotFound = () => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  // Mouse parallax effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring animation for mouse movement - adjusted for smoother feel
  // Increased damping for less oscillation, reduced stiffness for softer movement
  const springConfig = { damping: 30, stiffness: 100, mass: 1 }
  const mouseXSpring = useSpring(mouseX, springConfig)
  const mouseYSpring = useSpring(mouseY, springConfig)

  // Transform values for different layers
  // Reduced range for more subtle effect
  const x1 = useTransform(mouseXSpring, [-0.5, 0.5], [-20, 20])
  const y1 = useTransform(mouseYSpring, [-0.5, 0.5], [-20, 20])

  const x2 = useTransform(mouseXSpring, [-0.5, 0.5], [40, -40])
  const y2 = useTransform(mouseYSpring, [-0.5, 0.5], [40, -40])

  // Reduced rotation range to avoid dizziness
  const titleRotateX = useTransform(mouseYSpring, [-0.5, 0.5], [5, -5])
  const titleRotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-5, 5])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const width = rect.width
      const height = rect.height
      const mouseXRelative = e.clientX - rect.left
      const mouseYRelative = e.clientY - rect.top

      // Normalize coordinates to -0.5 to 0.5
      mouseX.set((mouseXRelative / width) - 0.5)
      mouseY.set((mouseYRelative / height) - 0.5)
    }
  }

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseMove={handleMouseMove}
    >
      {/* Background Elements */}
      <div className={styles.background}>
        <motion.div
          className={`${styles.blurCircle} ${styles.circle1}`}
          style={{ x: x1, y: y1 }}
        />
        <motion.div
          className={`${styles.blurCircle} ${styles.circle2}`}
          style={{ x: x2, y: y2 }}
        />
        <motion.div
          className={`${styles.blurCircle} ${styles.circle3}`}
        />
      </div>

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className={styles.titleWrapper}
          style={{
            rotateX: titleRotateX,
            rotateY: titleRotateY,
            perspective: 1000
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <h1 className={styles.title}>404</h1>
        </motion.div>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Page Not Found
        </motion.p>

        <motion.button
          className={styles.homeBtn}
          onClick={() => navigate('/home')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  )
}

export default NotFound
