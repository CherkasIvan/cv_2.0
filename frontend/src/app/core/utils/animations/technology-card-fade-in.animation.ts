import { 
  animate, 
  animation, 
  group, 
  keyframes, 
  query, 
  sequence, 
  stagger, 
  style, 
  transition, 
  trigger, 
  useAnimation 
} from '@angular/animations';

// Создаем переиспользуемые анимации
export const fadeInUp = animation([
  style({ opacity: 0, transform: 'translateY(20px)' }),
  animate('{{ duration }} {{ delay }} {{ easing }}', 
    style({ opacity: 1, transform: 'translateY(0)' })
  )
], {
  params: {
    duration: '0.5s',
    delay: '0s',
    easing: 'ease-out'
  }
});

export const technologyCardFadeIn = trigger('cardFadeIn', [
  transition(':enter', [
    useAnimation(fadeInUp, {
      params: {
        duration: '0.5s',
        delay: '{{ delay }}',
        easing: 'ease-out'
      }
    })
  ])
]);

export const listAnimation = trigger('listAnimation', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger('100ms', [
        animate('0.5s 0.3s ease-out', 
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ], { optional: true })
  ])
]);