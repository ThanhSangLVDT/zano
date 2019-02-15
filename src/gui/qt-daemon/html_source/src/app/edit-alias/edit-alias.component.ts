import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {BackendService} from "../_helpers/services/backend.service";
import {VariablesService} from "../_helpers/services/variables.service";
import {ModalService} from '../_helpers/services/modal.service';
import {Wallet} from "../_helpers/models/wallet.model";

@Component({
  selector: 'app-edit-alias',
  templateUrl: './edit-alias.component.html',
  styleUrls: ['./edit-alias.component.scss']
})
export class EditAliasComponent implements OnInit {

  wallet: Wallet;
  alias: any;
  notEnoughMoney: boolean;

  constructor(
    private location: Location,
    private router: Router,
    private backend: BackendService,
    private variablesService: VariablesService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.wallet = this.variablesService.currentWallet;
    const alias = this.backend.getWalletAlias(this.wallet.address);
    this.alias = {
      name: alias.name,
      address: alias.address,
      comment: alias.comment
    };
    this.notEnoughMoney = this.wallet.unlocked_balance.isLessThan(this.variablesService.default_fee_big);
  }

  updateAlias() {
    if (this.notEnoughMoney) {
      return;
    }
    this.backend.updateAlias(this.wallet.wallet_id, this.alias, this.variablesService.default_fee, (status) => {
      if (status) {
        this.modalService.prepareModal('success', '');
        this.router.navigate(['/wallet/' + this.wallet.wallet_id]);
        this.wallet.alias['comment'] = this.alias.comment;
      }
    });
  }

  back() {
    this.location.back();
  }
}