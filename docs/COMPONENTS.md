# Component Documentation

## Navigation Component

### Purpose
Fixed header navigation with theme toggle, resume download, and responsive mobile menu.

### Props
None - uses React Router hooks and theme context.

### Features
- Fixed positioning with backdrop blur
- Theme toggle with smooth transitions
- Resume download functionality
- Mobile hamburger menu
- Active route highlighting
- Custom cursor integration

### Usage
```tsx
<Navigation />
```

## CustomCursor Component

### Purpose
Interactive custom cursor that responds to different elements and provides visual feedback.

### Features
- Smooth cursor following with GSAP
- Different states for interactive elements
- Text hover effects
- Pointer hover scaling
- Mix-blend-mode for visibility

### Usage
```tsx
<CustomCursor />
```

## Hero Component

### Purpose
Large typography-focused introduction section with animated elements.

### Features
- Responsive typography scaling
- GSAP timeline animations
- Professional information display
- Scroll indicator
- Grid-based information layout

### Usage
```tsx
<Hero />
```

## About Component

### Purpose
Personal introduction with decorative geometric elements.

### Features
- Two-column responsive layout
- Professional photo with decorative frames
- Animated content reveals
- Statistics display
- Swiss design geometric elements

### Usage
```tsx
<About />
```

## Skills Component

### Purpose
Technical expertise showcase with clean categorization.

### Features
- Grid-based skill organization
- Category-based grouping
- Hover effects on skill items
- Decorative grid background
- Responsive layout

### Usage
```tsx
<Skills />
```

## Timeline Component

### Purpose
Professional journey visualization with alternating layout.

### Features
- Vertical timeline with central line
- Alternating left/right positioning
- Icon-based categorization
- Animated reveals on scroll
- Responsive stacking on mobile

### Usage
```tsx
<Timeline />
```

## BlogSection Component

### Purpose
Latest articles and insights showcase.

### Features
- Grid-based article layout
- Category and metadata display
- Large number overlays
- External link integration
- Hover effects and transitions

### Usage
```tsx
<BlogSection />
```

## TestimonialPreview Component

### Purpose
Client feedback preview with link to full guestbook.

### Features
- Card-based testimonial display
- Initial badges for clients
- Link to full guestbook page
- Animated reveals
- Responsive grid layout

### Usage
```tsx
<TestimonialPreview />
```

## Contact Component

### Purpose
Multiple contact methods and availability information.

### Features
- Contact method organization
- Location and timezone display
- Service listing
- Call-to-action with email integration
- Responsive two-column layout

### Usage
```tsx
<Contact />
```

## Footer Component

### Purpose
Site footer with navigation and copyright information.

### Features
- Multi-column layout
- Navigation links
- Contact information
- Copyright notice
- Responsive stacking

### Usage
```tsx
<Footer />
```

## ThemeProvider Component

### Purpose
Global theme management with persistent storage.

### Props
```tsx
interface ThemeProviderProps {
  children: React.ReactNode;
}
```

### Features
- Light/dark theme switching
- localStorage persistence
- CSS class management
- Context API integration
- Error handling for storage

### Usage
```tsx
<ThemeProvider>
  <App />
</ThemeProvider>
```

## Animation Patterns

### Common GSAP Patterns

#### Fade In with Slide Up
```tsx
gsap.fromTo(
  element,
  { y: 50, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
    },
  }
);
```

#### Staggered Animations
```tsx
gsap.fromTo(
  elements,
  { y: 30, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
  }
);
```

#### Hover Effects
```tsx
element.addEventListener('mouseenter', () => {
  gsap.to(element, {
    scale: 1.05,
    duration: 0.3,
    ease: 'power2.out',
  });
});
```

## Responsive Design Patterns

### Grid Layouts
```tsx
className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
```

### Typography Scaling
```tsx
className="text-4xl md:text-6xl font-light tracking-tight"
```

### Spacing Adjustments
```tsx
className="px-8 py-32 max-w-7xl mx-auto"
```

## Accessibility Features

### Semantic HTML
- Proper heading hierarchy
- Semantic section elements
- Descriptive alt text
- Form labels and associations

### Keyboard Navigation
- Focus management
- Tab order optimization
- Skip links where needed
- Keyboard event handling

### Screen Reader Support
- ARIA labels and descriptions
- Screen reader only text
- Proper form associations
- Meaningful link text

## Performance Optimizations

### Image Optimization
- WebP format with fallbacks
- Proper aspect ratios
- Lazy loading implementation
- Responsive image sizing

### Code Splitting
- Route-based splitting
- Component lazy loading
- Dynamic imports
- Bundle size optimization

### Animation Performance
- GPU-accelerated properties
- RequestAnimationFrame usage
- Efficient selectors
- Cleanup on unmount