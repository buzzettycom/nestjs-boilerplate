import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from '../shared/database/database.service';
import { UtilsService } from '../shared/utils/utils.service';
import { Contact } from '../shared/entities';
import type {
  HealthResponse,
  PublicDataResponse,
  ContactData,
} from '../shared/interfaces';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly utilsService: UtilsService,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  getHealth(): HealthResponse {
    return {
      status: 'OK',
      timestamp: this.utilsService.formatDate(new Date()),
      version: '1.0.0',
    };
  }

  getPublicData(): PublicDataResponse {
    // Get public data that doesn't require authentication
    return {
      message: 'Welcome to our API',
      features: ['Fast', 'Reliable', 'Secure'],
      timestamp: this.utilsService.formatDate(new Date()),
    };
  }

  async submitContact(contactData: ContactData): Promise<Contact> {
    // Submit contact form
    const sanitizedEmail = this.utilsService.sanitizeInput(contactData.email);
    const sanitizedMessage = this.utilsService.sanitizeInput(
      contactData.message,
    );

    if (!this.utilsService.validateEmail(sanitizedEmail)) {
      throw new Error('Invalid email format');
    }

    // Create new contact entry
    const newContact = this.contactRepository.create({
      email: sanitizedEmail,
      name: contactData.name,
      subject: contactData.subject,
      message: sanitizedMessage,
      status: 'pending',
    });

    return this.contactRepository.save(newContact);
  }
}
